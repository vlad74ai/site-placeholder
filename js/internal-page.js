import { enhanceSidebar } from './ui/sidebar.js?v=map-w8-1';
import { enhanceCopy } from "./ui/internal-copy.js?v=af-practice-1";
import { enhanceTOC } from "./ui/internal-toc.js?v=native-pages-2";

enhanceSidebar();

// Independent enhancements: failure of one never removes article content.
try { enhanceCopy(); } catch (error) { console.error("Copy enhancement failed", error); }
try { enhanceTOC(document.querySelector(".internal-layout")); }
catch (error) { console.error("TOC enhancement failed", error); }

import { enhancePrimaryNavigation } from './ui/header.js';

enhancePrimaryNavigation(document.querySelector('[data-primary-nav]'));

import('./ui/internal-tools.js?v=map-w8-1').then(({ enhanceInternalTools }) => enhanceInternalTools())
  .catch(error => console.warn('Site tools unavailable', error));
// Search data is optional; a failed search import cannot block Copy or TOC.
import('./ui/internal-search.js?v=public-prune-1').then(({ enhanceInternalSearch }) => enhanceInternalSearch())
  .catch(error => console.warn('Search enhancement unavailable', error));
