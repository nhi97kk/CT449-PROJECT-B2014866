class MongooseQuery {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    let queryObject = { ...this.queryObject };

    // Remove sort, page, limit from filter
    const excludedFields = ['sort', 'page', 'limit'];
    excludedFields.forEach((field) => delete queryObject[field]);

    this.query = this.query.find(queryObject);
    return this;
  }

  sort() {
    let sortBy;
    if (this.queryObject.sort) {
      // Convert sortBy from "field1,-field2" to "field1 -field2"
      sortBy = this.queryObject.sort.split(',').join(' ');
    } else {
      // Default sortBy time created
      sortBy = '-createdAt -updatedAt';
    }

    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const limit = this.queryObject.limit || process.env.MONGOOSE_LIMIT_PER_PAGE_DEFAULT;
    const page = this.queryObject.page || 1;

    const skipDoc = limit * (page - 1);
    this.query = this.query.skip(skipDoc).limit(limit * 1);

    return this;
  }
}

module.exports = MongooseQuery;
