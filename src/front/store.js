export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    companies: [],
    setCompany: null,
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case 'set_companies': {
      return {
        ...store, companies: action.payload
      }
    }

    case 'set_company': {
      return {
        ...store, selectedCompany: action.payload
      }
    }

    case 'add_company': {
      console.log('Por aca andamos')
      const newCompanies = store.companies.some(c => c.id === action.payload.id)
        ? store.companies.map(c => c.id === action.payload.id ? action.payload : c)
        : [...store.companies, action.payload]
      return {
        ...store, companies: newCompanies
      }
    }

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':

      const { id, color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }
}
