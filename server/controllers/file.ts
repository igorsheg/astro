/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Context } from 'koa';
interface FileUploadControllerProps {
  upload: (ctx: Context) => Promise<any>;
}

interface ParsedUpload {
  mtime: string;
  name: string;
  path: string;
  size: number;
  type: string;
}
export default (): FileUploadControllerProps => {
  const upload = async (ctx: Context) => {
    if (ctx.request.files) {
      //@ts-ignore
      const filesReq = ctx.request.files as any;
      const logo: File = filesReq.logo;
      const logoRes: ParsedUpload = JSON.parse(JSON.stringify(logo));
      return (ctx.body = logoRes);
    }
  };

  return {
    upload,
  };
};
