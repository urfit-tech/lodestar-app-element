export interface LodestarWindow extends Window {
  //for sdk feature
  lodestar: LodestarSDK
}

type LodestarSDK = {
  getCurrentMember: () => { [key: string]: any } | null
  getDataLayerByEvent: (event: string) => { [key: string]: any } | null
}
