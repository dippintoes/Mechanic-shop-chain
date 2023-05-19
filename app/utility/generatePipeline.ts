//brand=["puma","adidas"]
//price:{gt:90,lt:120};
//age=12

export const generatePipeline = (query: any) => {
  let pipeline: any = [];
  const { sort, limit = 5, sortdir = "desc", page = 1, ...filter } = query;

  for (let field in filter) {
    if (Array.isArray(field[filter])) {
      const stage = {
        $match: {
          field: {
            $in: filter[field],
          },
        },
      };
      pipeline.push(stage);
    } else if (typeof filter[field] === "object") {
      const stage: IObject = {};
      for (let [key, value] of Object.entries(filter[field])) {
        stage[`$${key}`] = Number(value);
      }
      pipeline.push({
        $match: {
          [field]: stage,
        },
      });
    } else {
      pipeline.push({
        $match: {
          [field]: filter[field],
        },
      });
    }
  }

  const sortObject: IObject = {};

  if (sort) {
    sortObject[sort] = sortdir == (1 || "asc") ? 1 : -1;
    pipeline.push({ $sort: sortObject });
  }
  if (limit && page) {
    pipeline.push({
      $skip: Number(page - 1) * limit,
    });
    pipeline.push({
      $limit: Number(limit),
    });
  }
  return pipeline;
};

export interface IObject {
  [key: string]: number | string;
}
