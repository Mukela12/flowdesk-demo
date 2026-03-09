/**
 * Curated Unsplash image URLs organized by category.
 * Each theme can pull from relevant categories for its demo context.
 */

const collections: Record<string, string[]> = {
  logistics: [
    'photo-1586528116311-ad8dd3c8310d', // warehouse
    'photo-1553413077-190dd305871c', // shipping containers
    'photo-1601584115197-04ecc0da31d7', // delivery truck
    'photo-1566576721346-d4a3b4eaeb55', // cargo ship
    'photo-1578575437130-527eed3abbec', // warehouse interior
    'photo-1494412574643-ff11b0a5eb19', // logistics aerial
    'photo-1591768793355-74d04bb6608f', // package delivery
    'photo-1581092160607-ee22621dd758', // supply chain
  ],
  business: [
    'photo-1497366216548-37526070297c', // modern office
    'photo-1497215842964-222b430dc094', // glass building
    'photo-1556761175-b413da4baf72', // team meeting
    'photo-1552664730-d307ca884978', // presentation
    'photo-1600880292203-757bb62b4baf', // business handshake
    'photo-1551836022-deb4988cc6c0', // data analytics
    'photo-1460925895917-afdab827c52f', // stock market
    'photo-1554224155-6726b3ff858f', // charts
  ],
  healthcare: [
    'photo-1576091160399-112ba8d25d1d', // hospital
    'photo-1631217868264-e5b90bb7e133', // medical team
    'photo-1579684385127-1ef15d508118', // lab
    'photo-1581093588401-fbb62a02f120', // stethoscope
    'photo-1516549655169-df83a0774514', // medical tech
    'photo-1530497610245-94d3c16cda28', // healthcare worker
    'photo-1551076805-e1869033e561', // hospital room
    'photo-1559757175-0eb30cd8c063', // pharmacy
  ],
  tech: [
    'photo-1518770660439-4636190af475', // circuits
    'photo-1488590528505-98d2b5aba04b', // laptop glow
    'photo-1550751827-4bd374c3f58b', // server room
    'photo-1519389950473-47ba0277781c', // tech workspace
    'photo-1504639725590-34d0984388bd', // code screen
    'photo-1581091226825-a6a2a5aee158', // tech abstract
    'photo-1526374965328-7f61d4dc18c5', // matrix code
    'photo-1573164713988-8665fc963095', // robotics
  ],
  people: [
    'photo-1573496359142-b8d87734a5a2', // professional woman
    'photo-1560250097-0b93528c311a', // businessman
    'photo-1522071820081-009f0129c71c', // team collaboration
    'photo-1531482615713-2afd69097998', // diverse team
    'photo-1519085360753-af0119f7cbe7', // confident professional
    'photo-1507003211169-0a1dd7228f2d', // headshot man
    'photo-1494790108377-be9c29b29330', // headshot woman
    'photo-1553484771-371a605b060b', // creative team
  ],
  education: [
    'photo-1523050854058-8df90110c476', // university
    'photo-1427504494785-3a9ca7044f45', // campus
    'photo-1503676260728-1c00da094a0b', // library
    'photo-1524178232363-1fb2b075b655', // classroom
    'photo-1434030216411-0b793f4b4173', // studying
    'photo-1509062522246-3755977927d7', // graduation
    'photo-1546410531-bb4caa6b3489', // books
    'photo-1580582932707-520aed937b7b', // university building
  ],
  nature: [
    'photo-1441974231531-c6227db76b6e', // forest
    'photo-1506744038136-46273834b3fb', // mountains
    'photo-1501854140801-50d01698950b', // lake
    'photo-1518173946687-a0f90ce4f2a7', // trees
    'photo-1470071459604-3b5ec3a7fe05', // nature path
    'photo-1469474968028-56623f02e42e', // sunset
    'photo-1465146344425-f00d5f5c8f07', // flowers
    'photo-1433086966358-54859d0ed716', // waterfall
  ],
  food: [
    'photo-1504674900247-0877df9cc836', // gourmet dish
    'photo-1476224203421-9ac39bcb3327', // restaurant
    'photo-1414235077428-338989a2e8c0', // fine dining
    'photo-1543353071-087092ec393a', // coffee
    'photo-1565299624946-b28f40a0ae38', // pizza
    'photo-1498837167922-ddd27525d352', // healthy food
    'photo-1540189549336-e6e99c3679fe', // dessert
    'photo-1567620905732-2d1ec7ab7445', // breakfast
  ],
}

interface UnsplashOptions {
  w?: number
  h?: number
  q?: number
  fit?: 'crop' | 'clamp' | 'fill' | 'scale'
}

/**
 * Get an Unsplash image URL by category and index.
 *
 * @param category - The category name (e.g., 'logistics', 'business', 'tech')
 * @param index - Index within the category (wraps around)
 * @param options - Image sizing options
 * @returns Full Unsplash URL with size parameters
 */
export function getUnsplashUrl(
  category: keyof typeof collections,
  index: number,
  options: UnsplashOptions = {},
): string {
  const { w = 800, h = 600, q = 80, fit = 'crop' } = options
  const images = collections[category] || collections.business
  const id = images[index % images.length]
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=${q}&fit=${fit}&auto=format`
}

/**
 * Get all image URLs for a category.
 */
export function getUnsplashCategory(category: keyof typeof collections): string[] {
  return (collections[category] || []).map(
    (id) => `https://images.unsplash.com/${id}?w=800&h=600&q=80&fit=crop&auto=format`,
  )
}

/**
 * Get available categories.
 */
export function getUnsplashCategories(): string[] {
  return Object.keys(collections)
}

export default collections
