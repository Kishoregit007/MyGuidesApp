import { lazy } from 'react'

const CareerRoadmap = lazy(() => import('./career_roadmap_v2.jsx'))
const SideHustleGuide = lazy(() => import('./side_hustle_guide.jsx'))
const WellnessPlan = lazy(() => import('./wellness_plan.jsx'))
const ChildDevelopment = lazy(() => import('./ChildDevelopmentGuide.jsx'))
const WealthMasterPlan = lazy(() => import('./wealth_master_plan.jsx'))
const MicroSaaSGuide = lazy(() => import('./Service-based_micro-business_guide.jsx'))
const ProtectionPlan = lazy(() => import('./protection_blueprint.jsx'))
const DsaDeepRef = lazy(() => import('./dsa_deep_reference.jsx'))
const BiflIndiaguide = lazy(() => import('./BIFLIndiaGuide.jsx'))
const DomainMastery = lazy(() => import('./kp_domain_mastery.jsx'))
const NatureGuide = lazy(() => import('./kp_true_nature_guide.jsx'))
const SeniorEngineerChecklist = lazy(() => import('./SeniorEngineerChecklist.jsx'))

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
      },
      {
        id: 'domain-mastery',
        name: 'Domain Mastery',
        icon: '🧠',
        description: 'Deep dive into domain-specific knowledge and skills',
        component: DomainMastery
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
        icon: '🛡️',
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
        icon: '💻',
        description: 'Guide to building and scaling a micro SaaS business',
        component: MicroSaaSGuide
      }
    ]
  },
  {
    id: 'bifl-india',
    name: 'BIFL India Guide',
    icon: '🇮🇳',
    description: 'Comprehensive guide for BIFL in India',
    component: BiflIndiaguide
  },
  {
    id: 'senior-engineer-checklist',
    name: "Senior Engineer Checklist",
    icon: '🛠️',
    description: 'Senior Engineer domain checklist HTML guide',
    component: SeniorEngineerChecklist
  },
  {
    id: 'nature-guide',
    name: 'Nature Guide',
    icon: '🌲',
    description: 'Guide to understanding and connecting with the natural world',
    component: NatureGuide
  }
]
