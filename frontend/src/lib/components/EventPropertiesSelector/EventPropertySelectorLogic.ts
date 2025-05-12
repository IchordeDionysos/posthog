import { lemonToast } from '@posthog/lemon-ui'
import { actions, kea, listeners, path, props, reducers } from 'kea'

import { PropertyDefinition, PropertyType } from '~/types'

import type { eventPropertySelectorLogicType } from './EventPropertySelectorLogicType'

export interface EventProperty {
    id: string
    name: string
    type: PropertyType | '-'
}

export interface EventPropertySelectorLogicProps {
    value: EventProperty[]
    onChange: (properties: EventProperty[]) => void
    onSave: (properties: EventProperty[]) => Promise<boolean>
}

export const eventPropertySelectorLogic = kea<eventPropertySelectorLogicType>([
    path(['lib', 'components', 'EventPropertiesSelector', 'EventPropertySelectorLogic']),
    props({} as EventPropertySelectorLogicProps),
    actions({
        setDraftProperties: (properties: EventProperty[]) => ({ properties }),
        addProperty: (item: PropertyDefinition) => ({ item }),
        removeProperty: (id: string) => ({ id }),
        setOpen: (open: boolean) => ({ open }),
        save: true,
    }),
    reducers({
        draftProperties: [
            [],
            {
                setDraftProperties: (_, { properties }) => properties,
                addProperty: (state, { item }) =>
                    state.some((prop: EventProperty) => prop.id === item.id)
                        ? state
                        : [
                              ...state,
                              {
                                  id: item.id,
                                  name: item.name,
                                  type: item.property_type ?? '-',
                              },
                          ],
                removeProperty: (state, { id }) => state.filter((prop: EventProperty) => prop.id !== id),
            },
        ],
        open: [
            false,
            {
                setOpen: (_, { open }) => open,
            },
        ],
    }),
    listeners(({ values, props }) => ({
        addProperty: () => {
            props.onChange?.(values.draftProperties)
        },
        removeProperty: () => {
            props.onChange?.(values.draftProperties)
        },
        save: async () => {
            try {
                const success = await props.onSave?.(values.draftProperties)
                if (!success) {
                    lemonToast.error('Failed to save properties. Please try again.')
                }
            } catch (error: any) {
                lemonToast.error(error.message)
            }
        },
    })),
])
