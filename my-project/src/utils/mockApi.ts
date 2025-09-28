import { TableRow, Role, Status } from '@/types/table';

const FIRST_NAMES = [
  'John',
  'Jane',
  'Michael',
  'Sarah',
  'David',
  'Emily',
  'Robert',
  'Jessica',
  'William',
  'Ashley',
  'James',
  'Amanda',
  'Christopher',
  'Stephanie',
  'Daniel',
  'Melissa',
  'Matthew',
  'Nicole',
  'Anthony',
  'Elizabeth',
  'Mark',
  'Helen',
  'Donald',
  'Deborah',
  'Steven',
  'Rachel',
  'Paul',
  'Carolyn',
  'Andrew',
  'Janet',
  'Joshua',
  'Catherine',
  'Kenneth',
  'Maria',
  'Kevin',
  'Heather',
  'Brian',
  'Diane',
  'George',
  'Ruth',
  'Timothy',
  'Julie',
  'Ronald',
  'Joyce',
  'Jason',
  'Virginia',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
];

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
  'Design',
  'Legal',
  'IT',
  'Research',
];

const ROLES: Role[] = [
  'admin',
  'manager',
  'developer',
  'designer',
  'analyst',
  'intern',
];
const STATUSES: Status[] = ['active', 'inactive', 'pending', 'suspended'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
};

const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['company.com', 'corp.com', 'business.org', 'enterprise.net'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
};

export const generateMockData = (count: number): TableRow[] => {
  const data: TableRow[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    const joinDate = getRandomDate(
      new Date(2020, 0, 1),
      new Date(2024, 11, 31)
    );
    const lastActive = getRandomDate(new Date(2024, 0, 1), new Date());

    data.push({
      id: `user-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      role: getRandomElement(ROLES),
      status: getRandomElement(STATUSES),
      score: Math.floor(Math.random() * 100) + 1,
      department: getRandomElement(DEPARTMENTS),
      joinDate,
      lastActive,
    });
  }

  return data;
};

// Simulate API delay
export const fetchMockData = async (
  count: number = 100000
): Promise<TableRow[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData(count));
    }, 500); // 500ms delay to simulate network request
  });
};
