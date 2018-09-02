export class Post {
    constructor(
        public id: number = null,
        public title: string = '',
        public content: string = '',
        public author_id: number = null,
        public author: string = '',
        public view_id: number = null,
        public view: string = '',
        public pub_date: string = '',
        public last_edited: string = ''
    ) { }
}
