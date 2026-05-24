export default defineEventHandler(
    async (event) => {
        const body =
            await readBody<{ message?: unknown }>(event)

        const message =
            typeof body?.message === 'string'
                ? body.message.trim()
                : ''

        if (!message) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'Message is required'
            })
        }

        const text =
            message.toLowerCase()

        if (text.includes('teamwork')) {
            return {
                message:
                    'Teamwork means employees working together effectively to achieve shared goals.'
            }
        }

        if (text.includes('shift')) {
            return {
                message:
                    'Check your Schedule tab for upcoming shifts.'
            }
        }

        return {
            message:
                'Shiftly AI is ready to help with schedules, team updates and workplace questions.'
        }
    }
)
