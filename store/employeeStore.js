let employees = JSON.parse(localStorage.getItem('employees')) || [];

export const getEmployees = () => employees;

export const addEmployee = (emp) => {
  emp.id = crypto.randomUUID();
  employees.push(emp);
  save();
};

export const updateEmployee = (updated) => {
  employees = employees.map(emp => emp.id === updated.id ? updated : emp);
  save();
};

export const deleteEmployee = (id) => {
  employees = employees.filter(emp => emp.id !== id);
  save();
};

const save = () => localStorage.setItem('employees', JSON.stringify(employees));
