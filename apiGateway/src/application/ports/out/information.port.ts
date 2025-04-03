/* DA METTERE I DTO RICHIESTI DA INFO CONTROLLE IN MIC SERV INFO*/

export interface InfoPort {
  fetchUpdate(req: any): Promise<Boolean>;
}