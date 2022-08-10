import { Card, Input, Title, Divider, Button, LoadingOverlay, Loader } from '@mantine/core';
import { hideNotification, showNotification } from '@mantine/notifications';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const onFromSubmit = async (e: FormEvent) => {
    hideNotification('login-error')
    e.preventDefault()
    try {
      setSubmitting(true)
      await axios.post('/api/auth/login', {
          username: usernameInput,
          password: passwordInput
      })
    } catch (err) {
      return showNotification({
          id: 'login-error',
          title: "Error!",
          message: err?.response?.data?.message,
          color: 'red',
          radius: 'xs',
      });
    } finally {
      setSubmitting(false)
    }

    showNotification({
        id: 'login-success',
        title: "Success!",
        message: "Logged in successfuly",
        color: 'green',
        radius: 'xs',
    });
    return router.push('/')
  }

  return (
  <>
    <Head>
        <title>Login</title>
    </Head>
    <form onSubmit={onFromSubmit} ref={formRef}>
    <Card p="xl">
      <Card.Section sx={(theme)=> ({
        borderBottom: '1px solid',
        borderColor: theme.colorScheme==='dark'?theme.colors.gray[7]:theme.colors.gray[3]
      })} px='md' py={'sm'}>
        <Title sx={(theme) => ({
            color: theme.colorScheme === 'dark' ? 'white' : 'black',
            margin: 0
        })} order={2}>Login</Title>
      </Card.Section>
      <Card.Section sx={(theme)=> ({
        borderBottom: '1px solid',
        borderColor: theme.colorScheme==='dark'?theme.colors.gray[7]:theme.colors.gray[3]
      })} style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
        <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
        <Input.Wrapper id={'username'} label="Username">
          <Input mt={'0.1rem'} required id={'username'} type='text' placeholder="Username" value={usernameInput} onChange={(e:ChangeEvent<any>) => setUsernameInput(e.target.value)} />
        </Input.Wrapper>
        <Input.Wrapper id={'pass'} label="Password">
          <Input mt={'0.1rem'} required min={6} id={'pass'} type='password' placeholder="Password" value={passwordInput} onChange={(e:ChangeEvent<any>) => setPasswordInput(e.target.value)} />
        </Input.Wrapper>
      </Card.Section>
      <Card.Section style={{ display: 'flex', justifyContent: 'space-between' }} px='md' py={'sm'}>
        <Link passHref href={'/register'}>
          <Button component='a' variant='light'>
            Register
          </Button>
        </Link>
        <Button type='submit'>
          Login
        </Button>
      </Card.Section>
    </Card>
    </form>
  </>
  );
};

export default LoginPage;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  if(ctx.req.cookies._token){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return{
    props: {}
  }
}