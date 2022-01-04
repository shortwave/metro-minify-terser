declare module "sync-rpc" {
  export default function startWorker<
    SetupArgs = any,
    RpcArgs = any,
    RpcResult = any
  >(filename: string, args: SetupArgs): (args: RpcArgs) => RpcResult;
}
