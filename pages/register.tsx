import { Card, Input, Title, Divider, Button, LoadingOverlay } from '@mantine/core';
import { hideNotification, showNotification } from '@mantine/notifications';
import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

const LoginPage = () => {
    const [usernameInput, setUsernameInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const onFormSubmit = async (e: FormEvent) => {
        hideNotification('register-error')
        e.preventDefault()
        try {
            setSubmitting(true)
            await axios.post('/api/auth/register', {
                username: usernameInput,
                password: passwordInput,
                confirm_password: confirmPasswordInput
            })
        } catch (err) {
            return showNotification({
                id: 'register-error',
                title: "Error!",
                message: err?.response?.data?.message,
                color: 'red',
                radius: 'xs',
            });
        } finally {
            setSubmitting(false)
        }

        showNotification({
            id: 'register-success',
            title: "Success!",
            message: "Registered successfuly",
            color: 'green',
            radius: 'xs',
        });
        return router.push('/login')
    }

    return (
        <>
        <Head>
            <title>Register</title>
        </Head>
        <form onSubmit={onFormSubmit} ref={formRef}>
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
                })} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
                    <Input.Wrapper id={'username'} error={!/^[a-zA-Z0-9_]*$/.test(usernameInput)&&"Username invalid, only alphanumeric characters and dashes allowed!"} label="Username">
                        <Input mt={'0.1rem'} required id={'username'} type='text' placeholder="Username" value={usernameInput} onChange={(e:ChangeEvent<any>) => setUsernameInput(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper id={'pass'} label="Password">
                        <Input mt={'0.1rem'} required min={6} id={'pass'} type='password' placeholder="Password" value={passwordInput} onChange={(e:ChangeEvent<any>) => setPasswordInput(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper id={'cpass'} label="Confirm Password">
                        <Input mt={'0.1rem'} required min={6} id={'cpass'} type='password' placeholder="Confirm Password" value={confirmPasswordInput} onChange={(e:ChangeEvent<any>) => setConfirmPasswordInput(e.target.value)} />
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