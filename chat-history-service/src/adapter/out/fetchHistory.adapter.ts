import { Injectable } from "@nestjs/common";
import { FetchHistoryPort } from "src/application/port/out/fetchHistory.port";


@Injectable()
export class FetchHistoryAdapter implements FetchHistoryPort{
    constructor(){}

    //return //to add mock for some tests
}