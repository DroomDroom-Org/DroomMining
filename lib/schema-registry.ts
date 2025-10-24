// Schema registry for structured data
export interface Schema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Store for registered schemas to prevent duplicates
let registeredSchemas: Schema[] = [];

/**
 * Register schemas to be added to the page
 * @param schemas One or more schema objects to register
 */
export function registerSchemas(schemas: Schema | Schema[]): void {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
  
  // Add each schema if it doesn't already exist
  schemaArray.forEach(schema => {
    const schemaType = schema['@type'];
    const exists = registeredSchemas.some(
      existingSchema => 
        existingSchema['@type'] === schemaType && 
        JSON.stringify(existingSchema) === JSON.stringify(schema)
    );
    
    if (!exists) {
      registeredSchemas.push(schema);
    }
  });
}

/**
 * Get all registered schemas
 */
export function getRegisteredSchemas(): Schema[] {
  return [...registeredSchemas];
}

/**
 * Clear all registered schemas
 */
export function clearSchemas(): void {
  registeredSchemas = [];
}
