const Product = require("../models/product");
const { BadRequest, NotFoundError } = require("../error");
const { StatusCodes } = require("http-status-codes");

const getAllProduct = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryOject = {};
  if (featured) {
    queryOject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryOject.company = company;
  }
  if (name) {
    queryOject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };

    const regularExpression = /\b(<|<=|=|>=|>)\b/g;

    let filters = numericFilters.replace(regularExpression, (match) => {
      return `-${operatorMap[match]}-`;
    });

    console.log(filters);

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((items) => {
      const [field, operator, value] = items.split("-");
      if (options.includes(field)) {
        queryOject[field] = { [operator]: Number(value) };
      }
    });

    console.log(queryOject);
  }

  let result = Product.find(queryOject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

const getProduct = async (req, res) => {
  const {
    params: { id: productID },
  } = req;

  const product = await Product.findOne({
    _id: productID,
  });

  if (!product) {
    throw new NotFoundError(`No product with id: ${productID}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const {
    body: { price, name },
    params: { id: productID },
  } = req;

  if (price === "" || name === "") {
    throw new BadRequest("Must provide company or name");
  }

  const product = await Product.findByIdAndUpdate(
    { _id: productID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new NotFoundError(`No product with id: ${productID}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const {
    params: { id: productID },
  } = req;

  const product = await Product.findByIdAndRemove({
    _id: productID,
  });

  if (!product) {
    throw new NotFoundError(`No product with id: ${productID}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
