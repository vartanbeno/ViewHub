export class Post {
    constructor(
        public id: number = null,
        public title: string = '',
        public content: string = '',
        public author_id: number = null,
        public author: string = '',
        public subtidder_id: number = null,
        public subtidder: string = '',
        public pub_date: string = '',
        public last_edited: string = ''
    ) { }
}
