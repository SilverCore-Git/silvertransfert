import { reactive } from 'vue';

interface ConfigState {
  home: any;
  download: any;
  navigation: any;
  faq: any;
  [key: string]: any;
}

const configState: ConfigState = reactive({
  home: {},
  download: {},
  navigation: {},
  faq: {}
});

async function loadConfigFiles() {
  try {
    const modules = import.meta.glob<{ default: any }>('/src/config/*.json');
    
    for (const path in modules) {
      const importFn = modules[path];
      if (typeof importFn === 'function') {
        const module = await importFn();
        const filename = path.split('/').pop()?.replace('.json', '');
        if (filename && module?.default) {
          configState[filename] = module.default;
        }
      }
    }
    
    console.log('Configuration files loaded successfully');
  } catch (error) {
    console.error('Failed to load configuration files:', error);
  }
}

// Helper function to get config value with template replacement
export function getConfigValue(path: string, replacements: Record<string, any> = {}): string {
  const parts = path.split('.');
  let current: any = configState;
  
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      console.warn(`Config path not found: ${path}`);
      return path; // Return the path as fallback
    }
  }
  
  if (typeof current === 'string') {
    // Replace template placeholders like {{variable}}
    return current.replace(/\{\{(\w+)\}\}/g, (match: string, variable: string) => {
      return replacements[variable] !== undefined ? replacements[variable] : match;
    });
  }
  
  return String(current);
}

// Initialize config loading
export function initConfig() {
  loadConfigFiles();
}

// Export the reactive config state for direct access
export const config = configState;