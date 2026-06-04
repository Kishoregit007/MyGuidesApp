import { lazy } from 'react'

const CareerRoadmap = lazy(() => import('./career_roadmap_v2.jsx'))
const SideHustleGuide = lazy(() => import('./side_hustle_guide.jsx'))
const WellnessPlan = lazy(() => import('./wellness_plan.jsx'))
const ChildDevelopment = lazy(() => import('./ChildDevelopmentGuide.jsx'))
const WealthMasterPlan = lazy(() => import('./wealth_master_plan.jsx'))
const MicroSaaSGuide = lazy(() => import('./Service-based_micro-business_guide.jsx'))

export const GUIDES = [
  {
    id: 'career',
    name: 'Career Roadmap',
    icon: '🎯',
    description: 'Java engineer roadmap with DSA & system design',
    component: CareerRoadmap
  },
  {
    id: 'sidehustle',
    name: 'Side Hustle Guide',
    icon: '💰',
    description: 'Multiple income stream opportunities',
    component: SideHustleGuide
  },
  {
    id: 'wellness',
    name: 'Wellness Plan',
    icon: '🧘',
    description: 'Physical and mental wellness strategies',
    component: WellnessPlan
  },
  {
    id: 'childdevelopment',
    name: 'Child Development',
    icon: '👶',
    description: 'Guidelines for child development and parenting',
    component: ChildDevelopment
  },
  {
    id: 'wealth',
    name: 'Wealth Master Plan',
    icon: '💎',
    description: 'Personal wealth-building roadmap for age 36+',
    component: WealthMasterPlan
  },
  {
    id: 'micro-saas',
    name: 'Micro SaaS Guide',
    icon: '�',
    description: 'Guide to building and scaling a micro SaaS business',
    component: MicroSaaSGuide
  }
]
