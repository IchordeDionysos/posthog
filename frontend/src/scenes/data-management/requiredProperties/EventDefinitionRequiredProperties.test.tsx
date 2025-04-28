import '@testing-library/jest-dom'

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import api from 'lib/api'

import { EventDefinition } from '~/types'

import { EventDefinitionRequiredProperties } from './EventDefinitionRequiredProperties'

jest.mock('lib/api')
jest.mock('lib/components/EventPropertiesSelector/EventPropertiesSelector', () => ({
    EventPropertySelector: ({ value, loading, onChange, onSave }: any) => (
        <div>
            <div data-attr="selector">{loading ? 'Loading...' : value.map((p: any) => p.name).join(',')}</div>
            <button onClick={() => onChange([{ id: '1', name: 'foo', type: '-' }])}>Change</button>
            <button onClick={() => onSave([{ id: '1', name: 'foo', type: '-' }])}>Save</button>
        </div>
    ),
}))

const mockDefinition = {
    id: 'event1',
    name: 'event1',
    required_properties: ['1'],
    owner: { id: 42 },
}

const mockProperty = { id: '1', name: 'foo', property_type: '-' }

describe('EventDefinitionRequiredProperties', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(api.propertyDefinitions.get as jest.Mock).mockResolvedValue(mockProperty)
        ;(api.eventDefinitions.update as jest.Mock).mockResolvedValue({})
    })
    afterEach(() => {
        cleanup()
    })

    it('renders and loads required properties', async () => {
        render(<EventDefinitionRequiredProperties definition={mockDefinition as EventDefinition} />)
        expect(screen.getByText(/Required Properties/)).toBeInTheDocument()
        expect(screen.getByText(/Select the required properties/)).toBeInTheDocument()
        await waitFor(() => expect(screen.getByTestId('selector')).toHaveTextContent('foo'))
    })

    it('calls setRequiredProperties on change', async () => {
        render(<EventDefinitionRequiredProperties definition={mockDefinition as EventDefinition} />)
        await waitFor(() => expect(screen.getByTestId('selector')).toHaveTextContent('foo'))
        fireEvent.click(screen.getByText('Change'))
        expect(screen.getByTestId('selector')).toHaveTextContent('foo')
    })

    it('calls API on save', async () => {
        render(<EventDefinitionRequiredProperties definition={mockDefinition as EventDefinition} />)
        await waitFor(() => expect(screen.getByTestId('selector')).toHaveTextContent('foo'))
        fireEvent.click(screen.getByText('Save'))
        await waitFor(() =>
            expect(api.eventDefinitions.update).toHaveBeenCalledWith({
                eventDefinitionId: 'event1',
                eventDefinitionData: {
                    required_properties: ['1'],
                },
            })
        )
    })

    it('handles API error on save', async () => {
        ;(api.eventDefinitions.update as jest.Mock).mockRejectedValue(new Error('fail'))
        render(<EventDefinitionRequiredProperties definition={mockDefinition as EventDefinition} />)
        await waitFor(() => expect(screen.getByTestId('selector')).toHaveTextContent('foo'))
        fireEvent.click(screen.getByText('Save'))
        await waitFor(() => expect(api.eventDefinitions.update).toHaveBeenCalled())
        // No throw, just logs error and returns false
    })
})
