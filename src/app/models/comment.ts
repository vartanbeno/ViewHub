export class Comment {
    constructor(
        public id: number = null,
        public body: string = '',
        public author_id: number = null,
        public author: string = '',
        public post_id: number = null,
        public pub_date: string = '',
        public last_edited: string = ''
    ) { }
}
