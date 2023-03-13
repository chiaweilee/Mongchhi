import { IApi } from '@mongchhi/types';
import fs from 'fs';
import path from 'path';
import { DIR_NAME } from './constants';

const themeFilePath = 'src/theme-token.json';

export default (api: IApi) => {
  // 第一部分：项目应用逻辑
  const localThemeFile = path.join(api.cwd, themeFilePath);
  // 本地有主题配置，进行加载
  if (fs.existsSync(localThemeFile))) {
    const tmpPath = `${DIR_NAME}/antd-theme-layout`;
    api.onGenerateFiles(() => {
      api.writeTmpFile({
        noPluginDir: true,
        path: tmpPath,
        content: `import React from 'react';
import { Outlet } from 'umi';
import { ConfigProvider } from 'antd';
import token from '${localThemeFile}';
export default () => (
  <ConfigProvider theme={{ token }}><Outlet /></ConfigProvider>
);
`,
      });
    });
    api.addLayouts(() => (
      [
        {
          id: 'mongchhi-antd-theme-layout',
          file: path.join(api.paths.absTmpPath, tmpPath)
        },
      ]
    ));
  }

  const getAntdThemeFromFile = (cwd = api.cwd as string): object => {
    const themeFile = path.join(cwd, themeFilePath);
    if (fs.existsSync(themeFile)) {
      const content = fs.readFileSync(themeFile, 'utf-8');
      try {
        const theme = JSON.parse(content);
        return theme;
      } catch (e) {}
    }
    return {};
  };

  // 第二部分：Mongchhi 管理逻辑
  const saveAntdThemeToFile = (
    cwd = api.cwd as string,
    token: object,
  ): void => {
    const themeFile = path.join(cwd, themeFilePath);
    fs.writeFileSync(themeFile, JSON.stringify(token), 'utf-8');
  };

  api.onMongChhiSocket(async ({ type, send, payload }) => {
    switch (type) {
      // 获取主题 token
      case 'get-antd-theme':
        send(
          JSON.stringify({
            type: 'get-antd-theme',
            payload: {
              token: getAntdThemeFromFile(payload?.cwd),
            },
          }),
        );
        break;
      // 写入主题 token
      case 'save-antd-theme':
        // 告诉客户端写入成功
        saveAntdThemeToFile(payload?.cwd, payload?.token ?? {});
        send(
          JSON.stringify({
            type: 'save-antd-theme-success',
          }),
        );
      default:
    }
  });
};
