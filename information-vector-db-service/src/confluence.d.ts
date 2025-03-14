import { ContentHistory } from 'confluence.js';

//doesn't work, i don't know why

declare module 'confluence.js'{
    interface ContentHistory{
        ownedBy: string;
    } 
}