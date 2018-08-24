export class User {
    constructor(
        public id: number = null,
        public first_name: string = '',
        public last_name: string = '',
        public email: string = '',
        public username: string = '',
        public password: string = '',
        public join_date: string = '',
        public biography: string = '',
        public image: string = ''
    ) { }
}
