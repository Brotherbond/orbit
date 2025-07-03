/**
 * Common label formatters for SelectWithFetch components
 * These can be reused across different forms and components
 */

export interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
  uuid: string;
}

export interface BaseEntity {
  name?: string;
  title?: string;
  uuid: string;
}

/**
 * Format user display as "Full Name (email)" or fallback to email
 */
export const userFullNameEmailFormatter = (user: User): string => {
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const email = user.email || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName ? `${fullName} (${email})` : email;
};

/**
 * Format user display as "Full Name" or fallback to email
 */
export const userFullNameFormatter = (user: User): string => {
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || user.email || user.name || "";
};

/**
 * Format user display as email only
 */
export const userEmailFormatter = (user: User): string => {
  return user.email || "";
};

/**
 * Format entity display with name and optional secondary info
 */
export const entityNameFormatter = (entity: BaseEntity): string => {
  return entity.name || entity.title || "";
};

/**
 * Format entity display with name and ID
 */
export const entityNameIdFormatter = (
  entity: BaseEntity & { id?: string },
): string => {
  const name = entity.name || entity.title || "";
  const id = entity.id || entity.uuid;
  return name ? `${name} (${id})` : id;
};

/**
 * Generic formatter that combines multiple fields with separator
 */
export const createCombinedFormatter = <T>(
  fields: (keyof T)[],
  separator: string = " - ",
) => {
  return (item: T): string => {
    const values = fields
      .map((field) => item[field])
      .filter((value) => value && String(value).trim())
      .map((value) => String(value).trim());

    return values.join(separator);
  };
};

/**
 * Generic formatter that creates "Primary (Secondary)" format
 */
export const createPrimarySecondaryFormatter = <T>(
  primaryField: keyof T,
  secondaryField: keyof T,
) => {
  return (item: T): string => {
    const primary = item[primaryField] ? String(item[primaryField]).trim() : "";
    const secondary = item[secondaryField]
      ? String(item[secondaryField]).trim()
      : "";

    if (primary && secondary) {
      return `${primary} (${secondary})`;
    }
    return primary || secondary || "";
  };
};
