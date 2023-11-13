import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { FILTER_OPERATOR } from '../configs/main.config';
import { HttpCoreException } from '../exceptions/core.exception';
import { FilterData } from './interfaces/filter-data.interface';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findWithPagination<T>(
    filters: FilterData,
    query: SelectQueryBuilder<T>,
    columns?: string[],
    columnsOverwrite?: string[],
  ) {
    console.log('[filters]', filters);

    if (columnsOverwrite) {
      columns = [...columns, ...columnsOverwrite];
    }

    let parameters = query.getQueryAndParameters()[1];
    console.log('parameters', parameters);

    if (filters.filters) {
      this.logger.debug(
        '@findWithPagination > filters > ' + JSON.stringify(filters.filters),
      );

      filters.filters.forEach((item) => {
        const fieldName = item.field;
        const operator = item.operator.toLocaleLowerCase();

        // filters.prefix_filter_field
        //   ? `${filters.prefix_filter_field}.${item.field}`
        //   : item.field;
        // Doi voi cac field la ngay => ToDate
        if (
          /ngay/.test(item.field) &&
          item.operator === FILTER_OPERATOR.LESS_THAN_OR_EQUAL_TO
        ) {
          item.value = `${item.value} 23:59:59`;
        }

        switch (operator) {
          case FILTER_OPERATOR.EQUAL:
            query.andWhere(`${fieldName} = :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.NOT_EQUAL:
            query.andWhere(`${fieldName} <> :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.CONTAIN:
            query.andWhere(`${fieldName} like :value`, {
              value: '%' + item.value + '%',
            });
            parameters.push('%' + item.value + '%');
            break;

          case FILTER_OPERATOR.LESS_THAN:
            query.andWhere(`${fieldName} < :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.LESS_THAN_OR_EQUAL_TO:
            query.andWhere(`${fieldName} <= :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.GREATER_THAN:
            query.andWhere(`${fieldName} > :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.GREATER_THAN_OR_EQUAL_TO:
            query.andWhere(`${fieldName} >= :value`, { value: item.value });
            parameters.push(item.value);
            break;

          case FILTER_OPERATOR.BETWEEN:
            item.value = JSON.parse(item.value);
            query.andWhere(`${fieldName} BETWEEN :value1 AND :value2`, {
              value1: item.value[0],
              value2: item.value[1],
            });
            parameters = parameters.concat(item.value);
            break;

          case FILTER_OPERATOR.INCLUDES:
            let values: any[];
            try {
              values = JSON.parse(item.value);
              if (typeof values !== 'object') {
                throw new HttpCoreException(
                  'Field ' + item.field + ' invalid',
                  '400',
                );
              }
            } catch (error) {
              throw new HttpCoreException(
                'Field ' + item.field + ' invalid',
                '400',
              );
            }
            query.andWhere(`${fieldName} IN (:...values)`, { values });
            parameters = parameters.concat(values);
            break;

          default:
            break;
        }
      });
    }

    const countQuery = query
      .getSql()
      .replace(/^SELECT(.*)FROM/g, 'SELECT COUNT(1) row_total FROM');

    // Cấu hình tên cột cần sort
    let sort_column = '';
    if (filters.sort_column) {
      const sorts = filters.sort_column.split('.');
      if (sorts.length < 2) {
        sort_column = query.alias + '.' + filters.sort_column;
      } else {
        sort_column = filters.sort_column;
      }
    }
    const sort_direction = filters['sort_direction']
      ? filters['sort_direction']
      : false;

    // Cấu hình sort
    if (sort_column && sort_direction) {
      query.orderBy(
        sort_column,
        sort_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );
    }

    // Phân trang
    const limit = filters.limit ? Number(filters.limit) : 10;
    if (limit > 0) {
      query.limit(limit);
    }
    const pageNum = filters.current ? Number(filters.current) : 1;
    if (pageNum > 0) {
      query.offset((pageNum - 1) * limit);
    }

    // Cấu hình các cột cần lấy
    query.select(columns || []);

    const getQuery = query.getSql();

    // console.log(query.getQueryAndParameters());
    // console.log('@getQuery > ', getQuery);
    // console.log('@countQuery > ', countQuery);
    // console.log('@parameters > ' + parameters);

    const [list, [countResult]] = await Promise.all([
      this.dataSource.query(getQuery, parameters),
      this.dataSource.query(countQuery, parameters),
    ]);

    const row_total = parseInt(countResult.row_total || '0');

    if (limit < 0) {
      return {
        data: list,
        total: row_total,
        total_current: list.length,
      };
    }

    const row_total_current = list.length;
    const from = limit * (pageNum - 1);
    const to = from + list.length;
    const last_page =
      Math.floor(row_total / limit) + (row_total % limit > 0 ? 1 : 0);
    const next_page = pageNum < last_page ? pageNum + 1 : pageNum;

    return {
      data: list,
      total: row_total,
      total_current: row_total_current,
      from: from + 1,
      to: to,
      current_page: pageNum,
      next_page: next_page,
      last_page: last_page,
    };
  }
}
