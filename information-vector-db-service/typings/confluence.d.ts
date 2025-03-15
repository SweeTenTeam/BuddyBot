import 'confluence.js/out/api/models'
import { User } from 'confluence.js/out/api/models';

declare module 'confluence.js/out/api/models' {
    interface ContentHistory {
        ownedBy: User;
    } 
}