import { Button } from 'antd';
import { useEffect } from 'react';
import { socket } from 'umi';
import yayJpg from '../assets/yay.jpg';

function HomePage() {
  useEffect(() => {
    // 支持卸载
    return socket.listen(({ type }) => {
      console.log(type);
      switch (type) {
        case 'simple-hi':
          alert('hello');
          break;
        default:
          break;
      }
    });
  }, []);
  return (
    <>
      <h2>Yay! Welcome to umi!</h2>
      <p>
        <p>Card content</p>
      </p>
      <p>
        <Button
          type="primary"
          onClick={() => {
            socket.send({
              type: 'call',
              payload: {
                type: 'simple-hi',
              },
            });
          }}
        >
          call
        </Button>
      </p>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
      <h2>Yay! Welcome to umi!</h2>
      <p>
        <p>Card content</p>
      </p>
      <p>
        <Button
          type="primary"
          onClick={() => {
            socket.send({
              type: 'call',
              payload: {
                type: 'simple-hi',
              },
            });
          }}
        >
          call
        </Button>
      </p>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </>
  );
}

export default HomePage;
