import Alert from 'react-bootstrap/Alert'
import { CategoryType } from '../types'

type AlertMessageProps = {
    message: string | undefined,
    category: CategoryType | undefined,
    flashMessage: ( newMessage: string |undefined, newCategory : CategoryType | undefined ) => void
}

//not currently being used to alert if something happens
export default function AlertMessage ({message, category, flashMessage}: AlertMessageProps){
    return (
        <Alert className = 'mt-3' variant= {category} dismissible onClose = {()=> flashMessage(undefined, undefined)}>{message}
        </Alert>
    )
}