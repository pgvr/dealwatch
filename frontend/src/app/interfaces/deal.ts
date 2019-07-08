export interface Deal {
    readonly name: string;
    readonly category: number;
    readonly date: Date;
    readonly percent: number;
    readonly link: string;
    readonly price_new: number;
    readonly price_old: number;
    readonly seller: string;
}
