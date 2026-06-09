import { lazy } from 'react'

const CareerRoadmap = lazy(() => import('./career_roadmap_v2.jsx'))
const SideHustleGuide = lazy(() => import('./side_hustle_guide.jsx'))
const WellnessPlan = lazy(() => import('./wellness_plan.jsx'))
const ChildDevelopment = lazy(() => import('./ChildDevelopmentGuide.jsx'))
const WealthMasterPlan = lazy(() => import('./wealth_master_plan.jsx'))
const MicroSaaSGuide = lazy(() => import('./Service-based_micro-business_guide.jsx'))
const ProtectionPlan = lazy(() => import('./protection_blueprint.jsx'))
const DsaDeepRef = lazy(() => import('./dsa_deep_reference.jsx'))

export const GUIDES = [
  {
    id: 'career',
    name: 'Career Roadmap',
    icon: '🎯',
    description: 'Java engineer roadmap with DSA & system design',
    component: CareerRoadmap,
    children: [
      {
        id: 'dsa',
        name: 'DSA Deep Reference',
        icon: '📚',
        description: 'Comprehensive reference for DSA concepts and problems',
        component: DsaDeepRef
      }
    ]
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
    component: WealthMasterPlan,
    children: [
      {
        id: 'protection',
        name: 'Protection Plan',
        icon: '�️',
        description: 'Comprehensive protection strategies for your assets',
        component: ProtectionPlan
      },
      {
        id: 'sidehustle',
        name: 'Side Hustle Guide',
        icon: '💰',
        description: 'Revenue diversification and income stream ideas',
        component: SideHustleGuide
      },
      {
        id: 'micro-saas',
        name: 'Micro SaaS Guide',
        icon: '�',
        description: 'Guide to building and scaling a micro SaaS business',
        component: MicroSaaSGuide
      }
    ]
  },
  
]
