
//Making of a utility function that enhances middleware functions by adding error handling
//eliminating the need for repetitive try-catch blocks in each asynchronous route handler.

const tryCatchHandler = (requestHandler) => {
    return async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    };
  };

  export { tryCatchHandler };