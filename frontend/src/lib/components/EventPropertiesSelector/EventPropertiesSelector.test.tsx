import '@testing-library/jest-dom'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { TaxonomicFilter } from 'lib/components/TaxonomicFilter/TaxonomicFilter'
import { TaxonomicFilterGroupType } from 'lib/components/TaxonomicFilter/types'

import { PropertyType } from '~/types'

import { EventPropertySelector } from './EventPropertiesSelector'

jest.mock('lib/components/TaxonomicFilter/TaxonomicFilter', () => ({
    TaxonomicFilter: jest.fn(() => null),
}))

afterEach(cleanup)

describe('EventPropertiesSelector', () => {
    const mockOnChange = jest.fn()
    const mockOnSave = jest.fn()

    const defaultProps = {
        loading: false,
        value: [],
        onChange: mockOnChange,
        onSave: mockOnSave,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders empty state correctly', () => {
        render(<EventPropertySelector {...defaultProps} />)
        expect(screen.getByText('No required properties')).toBeInTheDocument()
    })

    it('renders existing properties correctly', () => {
        const properties = [
            { id: 'id-prop1', name: 'prop1', type: PropertyType.String },
            { id: 'id-prop2', name: 'prop2', type: PropertyType.String },
        ]
        render(<EventPropertySelector {...defaultProps} value={properties} />)
        expect(screen.getByText('prop1')).toBeInTheDocument()
        expect(screen.getByText('prop2')).toBeInTheDocument()
    })

    it('opens taxonomic filter when add button is clicked', () => {
        render(<EventPropertySelector {...defaultProps} />)
        const addButton = screen.getByText('Add Property')
        fireEvent.click(addButton)
        expect(TaxonomicFilter).toHaveBeenCalledWith(
            expect.objectContaining({
                taxonomicGroupTypes: [TaxonomicFilterGroupType.EventProperties],
            }),
            expect.any(Object)
        )
    })

    it('adds property when selected from taxonomic filter', () => {
        render(<EventPropertySelector {...defaultProps} />)
        const addButton = screen.getByText('Add Property')
        fireEvent.click(addButton)

        // Simulate taxonomic filter selection
        const mockOnChangeHandler = (TaxonomicFilter as jest.Mock).mock.calls[0][0].onChange
        mockOnChangeHandler(null, null, { id: 'id-newProp', name: 'newProp', property_type: PropertyType.String })

        expect(mockOnChange).toHaveBeenCalledWith([{ id: 'id-newProp', name: 'newProp', type: PropertyType.String }])
    })

    it('removes property when remove button is clicked', () => {
        const properties = [{ id: 'id-prop1', name: 'prop1', type: PropertyType.String }]
        render(<EventPropertySelector {...defaultProps} value={properties} />)

        const removeButton = screen.getByText('Remove')
        fireEvent.click(removeButton)

        expect(mockOnChange).toHaveBeenCalledWith([])
    })

    // it('enables save button when changes are made', () => {
    //     render(<EventPropertySelector {...defaultProps} />)
    //     const saveButton = screen.getByText('Save Properties')
    //     expect(saveButton).toBeDisabled()

    //     // Add a property
    //     const addButton = screen.getByText('Add Property')
    //     fireEvent.click(addButton)
    //     const mockOnChangeHandler = (TaxonomicFilter as jest.Mock).mock.calls[0][0].onChange
    //     mockOnChangeHandler(null, null, { id: 'id-newProp', name: 'newProp', property_type: PropertyType.String })

    //     expect(saveButton).not.toBeDisabled()
    // })

    // it('disables save button while saving', async () => {
    //     mockOnSave.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(true), 100)))
    //     render(<EventPropertySelector {...defaultProps} value={[{ id: 'id-prop1', name: 'prop1', type: PropertyType.String }]} />)

    //     const saveButton = screen.getByText('Save Properties')
    //     fireEvent.click(saveButton)

    //     expect(saveButton).toBeDisabled()
    //     expect(saveButton).toHaveClass('LemonButton--loading')

    //     await waitFor(() => {
    //         expect(saveButton).not.toBeDisabled()
    //         expect(saveButton).not.toHaveClass('LemonButton--loading')
    //     })
    // })

    // it('shows error message when save fails', async () => {
    //     mockOnSave.mockResolvedValue(false)
    //     render(<EventPropertySelector {...defaultProps} value={[{ id: 'id-prop1', name: 'prop1', type: PropertyType.String }]} />)

    //     const saveButton = screen.getByText('Save Properties')
    //     fireEvent.click(saveButton)

    //     await waitFor(() => {
    //         expect(screen.getByText('Failed to save properties. Please try again.')).toBeInTheDocument()
    //     })
    // })

    // it('clears error message when new changes are made', async () => {
    //     mockOnSave.mockResolvedValue(false)
    //     render(<EventPropertySelector {...defaultProps} value={[{ id: 'id-prop1', name: 'prop1', type: PropertyType.String }]} />)

    //     // Trigger error
    //     const saveButton = screen.getByText('Save Properties')
    //     fireEvent.click(saveButton)
    //     await waitFor(() => {
    //         expect(screen.getByText('Failed to save properties. Please try again.')).toBeInTheDocument()
    //     })

    //     // Make new change
    //     const addButton = screen.getByText('Add Property')
    //     fireEvent.click(addButton)
    //     const mockOnChangeHandler = (TaxonomicFilter as jest.Mock).mock.calls[0][0].onChange
    //     mockOnChangeHandler(null, null, { id: 'id-newProp', name: 'newProp', property_type: PropertyType.String })

    //     expect(screen.queryByText('Failed to save properties. Please try again.')).not.toBeInTheDocument()
    // })
})
