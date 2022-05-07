export type MutationVariables<T, U> = T extends undefined
  ? {
      urlParams?: T;
      requestBody: U;
    }
  : U extends undefined
  ? {
      urlParams: T;
      requestBody?: U;
    }
  : {
      urlParams: T;
      requestBody: U;
    };

export type QueryVariables<T, U> = T extends undefined
  ? {
      urlParams?: T;
      queryParams: U;
    }
  : U extends undefined
  ? {
      urlParams: T;
      queryParams?: U;
    }
  : {
      urlParams: T;
      queryParams: U;
    };
