import { Card, Input, Title, Divider, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getUser, supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useRef } from 'react';

const LoginPage = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const onFromSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { error } = await supabaseClient.auth.signIn({
      email: formRef.current.email.value,
      password: formRef.current.pass.value,
    })
    if(error){
      return showNotification({
        id: 'login-error',
        title: "Error!",
        message: error.message,
        color: 'red',
        radius: 'xs',
      });
    }
    showNotification({
      id: 'login-success',
      title: "Success!",
      message: "Logged in successfuly",
      color: 'green',
      radius: 'xs',
    });
    router.push('/')
  }

  return (
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
      })} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
        <Input.Wrapper id={'email'} label="Email Address">
          <Input required id={'email'} type='email' placeholder="Email Address" />
        </Input.Wrapper>
        <Input.Wrapper id={'pass'} label="Password">
          <Input required min={6} id={'pass'} type='password' placeholder="Password" />
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
  );
};

export default LoginPage;

export const getServerSideProps = withPageAuth({
  authRequired: false,
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const { user } = await getUser(ctx);
    if (user)
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    else
      return {
        props: {}
      };
  }
});