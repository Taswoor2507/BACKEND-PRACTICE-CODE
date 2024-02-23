const asyncHandler = function (requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res)).catch((error) => {
      console.log("Error in asyncHandler", error);
      next(error);
    });
  };
};

export default asyncHandler;
