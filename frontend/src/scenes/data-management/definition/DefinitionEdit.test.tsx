import '@testing-library/jest-dom'

import { render, waitFor } from '@testing-library/react'
import { featureFlagLogic } from 'lib/logic/featureFlagLogic'

import { breadcrumbsLogic } from '~/layout/navigation/Breadcrumbs/breadcrumbsLogic'
import { useMocks } from '~/mocks/jest'
import { initKeaTests } from '~/test/init'
import { mockEventPropertyDefinition } from '~/test/mocks'
import { PropertyType } from '~/types'

import { DefinitionEdit } from './DefinitionEdit'
import { definitionLogic } from './definitionLogic'

describe('DefinitionEdit', () => {
    beforeEach(() => {
        useMocks({
            get: {
                '/api/projects/:team/property_definitions/:id': {
                    ...mockEventPropertyDefinition,
                    property_type: PropertyType.Enum,
                    property_type_enum: ['value1', 'value2'],
                },
            },
        })
        initKeaTests()
        breadcrumbsLogic().mount()
        featureFlagLogic().mount()
    })

    it('shows enum input field when property type is Enum', async () => {
        definitionLogic({ id: '1' }).mount()
        const { getByText } = render(<DefinitionEdit id="1" />)

        await waitFor(() => {
            expect(getByText('Enum values')).toBeInTheDocument()
            expect(getByText('value1')).toBeInTheDocument()
            expect(getByText('value2')).toBeInTheDocument()
        })
    })
})
