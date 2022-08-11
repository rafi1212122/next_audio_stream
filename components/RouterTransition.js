import Router from 'next/router'
import {
  startNavigationProgress,
  setNavigationProgress,
  NavigationProgress,
  stopNavigationProgress
} from '@mantine/nprogress';

export function RouterTransition() {
    Router.onRouteChangeStart = () => {
        setNavigationProgress(0)
        startNavigationProgress()
    }
    Router.onRouteChangeComplete = () => setNavigationProgress(100)
    Router.onRouteChangeError = () => setNavigationProgress(100)

    return<NavigationProgress withinPortal={false} onFinish={()=>{
            stopNavigationProgress()
        }}/>;
}