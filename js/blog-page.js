import { enhanceSidebar } from './ui/sidebar.js?v=map-w8-1';
import { enhancePrimaryNavigation } from './ui/header.js';
enhanceSidebar();
enhancePrimaryNavigation(document.querySelector('[data-primary-nav]'));
