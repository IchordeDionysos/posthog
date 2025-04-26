import { render } from '@testing-library/react'

import { mockEventPropertyDefinition } from '~/test/mocks'
import { PropertyType } from '~/types'

import { DefinitionEdit } from './DefinitionEdit'
import { definitionLogic } from './definitionLogic'

describe('DefinitionEdit', () => {
    it('shows enum input field when property type is Enum', () => {
        const enumPropertyDefinition = {
            ...mockEventPropertyDefinition,
            property_type: PropertyType.Enum,
            property_type_enum: ['value1', 'value2'],
        }

        const { getByLabelText } = render(<DefinitionEdit id="1" />)

        // Mock the definition value in the logic
        definitionLogic({ id: '1' }).mount()
        definitionLogic({ id: '1' }).actions.setDefinition(enumPropertyDefinition)

        expect(getByLabelText('Enum values')).toBeInTheDocument()
    })
})
