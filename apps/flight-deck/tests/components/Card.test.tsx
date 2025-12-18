import { render, screen } from '@testing-library/react'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'
import { describe, it, expect } from 'vitest'

describe('Card Component', () => {
    it('renders card title and content', () => {
        render(
            <Card>
                <CardTitle>Test Title</CardTitle>
                <CardContent>Test Content</CardContent>
            </Card>
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
})
