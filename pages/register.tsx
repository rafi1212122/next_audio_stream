import { Card, Input, Title, Divider, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getUser, supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { FormEvent, useRef } from 'react';

const LoginPage = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const onFromSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { error } = await supabaseClient.auth.signUp({
      email: formRef.current.email.value,
      password: formRef.current.pass.value,
    })
    if(error){
        return showNotification({
            id: 'register-error',
            title: "Error!",
            message: error.message,
            color: 'red',
            radius: 'xs',
        });
    }
    showNotification({
        id: 'register-success',
        title: "Success!",
        message: "Registered and Logged in successfuly",
        color: 'green',
        radius: 'xs',
    });
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
        })} order={2}>Register</Title>
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
        <Link passHref href={'/login'}>
          <Button component='a' variant='light'>
            Login
          </Button>
        </Link>
        <Button type='submit'>
          Register
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