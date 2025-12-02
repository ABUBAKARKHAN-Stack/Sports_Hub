export class ApiError<E> {
    constructor(
        public statusCode: number,
        public message: string,
        public error?: E,
    ) {

    }
}


