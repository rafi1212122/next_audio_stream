import Router from 'next/router'
import {
  startNavigationProgress,
  setNavigationProgress,
  NavigationProgress,
  stopNavigationProgress
} from '@mantine/nprogress';
import { useContext } from 'react';
import DataContext from '../helpers/DataContext';

export function RouterTransition() {
  const { setIsNavigating } = useContext(DataContext)
  Router.onRouteChangeStart = () => {
    setIsNavigating(true)
    setNavigationProgress(0)
    startNavigationProgress()
  }
  Router.onRouteChangeComplete = () => {
    setIsNavigating(false)
    setNavigationProgress(100)
  }
  Router.onRouteChangeError = () => {
    setIsNavigating(false)
    setNavigationProgress(100)
  }

  return<NavigationProgress withinPortal={false} onFinish={()=>{
    stopNavigationProgress()
  }}/>;
}