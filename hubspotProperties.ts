// hubspotProperties.ts - HubSpot CRM Properties API integration with caching

export async function getProperties(objectType: 'contacts'|'companies'|'deals'|'tickets'): Promise<string[]> {
  const key = objectType.toLowerCase() as 'contacts'|'companies'|'deals'|'tickets';
  const store = await chrome.storage.local.get(['propertiesByObject','lastFetched']);
  let byObj = store.propertiesByObject || {};
  const stale = !store.lastFetched || (Date.now() - store.lastFetched) > 24*60*60*1000;

  if (!byObj[key] || stale) {
    try {
      const names = await fetchHubSpotPropertyNames(key); // implement using existing auth module
      byObj[key] = names.sort((a,b)=>a.localeCompare(b));
      await chrome.storage.local.set({ propertiesByObject: byObj, lastFetched: Date.now() });
    } catch {
      byObj[key] = byObj[key] || []; // keep whatever we had
    }
  }
  return byObj[key] || [];
}

async function fetchHubSpotPropertyNames(objectType: string): Promise<string[]> {
  try {
    // Use the existing API call mechanism
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ 
        type: 'apiCall', 
        endpoint: `/crm/v3/properties/${objectType}` 
      }, (response) => {
        if (response && response.success && response.data && response.data.results) {
          const properties = response.data.results.map((prop: any) => prop.name);
          console.log(`✅ Fetched ${properties.length} properties for ${objectType}`);
          resolve(properties);
        } else {
          console.warn(`⚠️ No properties found for ${objectType}, using fallback`);
          resolve(getFallbackProperties(objectType));
        }
      });
    });
  } catch (error) {
    console.error(`❌ Error fetching properties for ${objectType}:`, error);
    return getFallbackProperties(objectType);
  }
}

function getFallbackProperties(objectType: string): string[] {
  const fallbackMap: Record<string, string[]> = {
    contacts: ['name', 'email', 'company', 'phone', 'createdate', 'lastmodifieddate', 'lifecyclestage', 'leadstatus'],
    companies: ['name', 'domain', 'phone', 'createdate', 'lastmodifieddate', 'lifecyclestage', 'industry'],
    deals: ['dealname', 'amount', 'dealstage', 'closedate', 'createdate', 'lastmodifieddate', 'pipeline'],
    tickets: ['subject', 'content', 'ticket_pipeline', 'ticket_stage', 'createdate', 'lastmodifieddate']
  };

  return fallbackMap[objectType] || ['name', 'createdate', 'lastmodifieddate'];
}
