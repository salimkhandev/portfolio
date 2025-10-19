import { Container, Header, MessageList, Composer, useWebchat, Fab } from '@botpress/webchat'
import { useState, useMemo } from 'react'
import profilePic from '/profilePic.webp'

const headerConfig = {
    botName: "Salim's Assistant",
    botAvatar: 'https://avatars.githubusercontent.com/u/147515973?v=4',
    botDescription: 'Your virtual assistant for all things support.',

    phone: {
        title: 'Call Support',
        link: 'tel:+923201970649',
    },

    email: {
        title: 'Email Us',
        link: 'mailto:salimkhandev@gmail.com',
    },

    website: {
        title: 'Visit Portfolio',
        link: 'https://github.com/salimkhandev',
    },

    termsOfService: {
        title: 'Terms of Service',
        link: 'https://github.com/salimkhandev',
    },

    privacyPolicy: {
        title: 'Privacy Policy',
        link: 'https://github.com/salimkhandev',
    },
}

function FloatingChat() {
    const [isWebchatOpen, setIsWebchatOpen] = useState(false)

    const { client, messages, isTyping, user, clientState, newConversation } = useWebchat({
        clientId: 'a6c7357f-fcef-4f45-8147-64ea05db31d5', // ✅ your client ID
    })

    const config = {
        botName: "Salim's Assistant",
        botAvatar: profilePic,
        botDescription: 'Your virtual assistant for all things support.',
    }

    const enrichedMessages = useMemo(
        () =>
            messages.map((message) => {
                const { authorId } = message
                const direction = authorId === user?.userId ? 'outgoing' : 'incoming'
                return {
                    ...message,
                    direction,
                    sender:
                        direction === 'outgoing'
                            ? { name: user?.name ?? 'You', avatar: user?.pictureUrl }
                            : { name: config.botName ?? 'Bot', avatar: config.botAvatar },
                }
            }),
        [config.botAvatar, config.botName, messages, user?.userId, user?.name, user?.pictureUrl]
    )

    const toggleWebchat = () => {
        setIsWebchatOpen((prev) => !prev)
    }

    return (
        <>
            {/* Chat Container */}
            <Container
                connected={clientState !== 'disconnected'}
                style={{
                    width: '380px',
                    height: '600px',
                    display: isWebchatOpen ? 'flex' : 'none',
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#111827',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
                    zIndex: 9998,
                }}
            >
                <Header
                    defaultOpen={false}
                    closeWindow={() => setIsWebchatOpen(false)}
                    restartConversation={newConversation}
                    disabled={false}
                    configuration={headerConfig}
                />
                <MessageList
                    botName={config.botName}
                    botDescription={config.botDescription}
                    isTyping={isTyping}
                    headerMessage="Chat with Salim's Assistant"
                    showMarquee={true}
                    messages={enrichedMessages}
                    sendMessage={client?.sendMessage}
                />
                <Composer
                    disableComposer={false}
                    isReadOnly={false}
                    allowFileUpload={true}
                    connected={clientState !== 'disconnected'}
                    sendMessage={client?.sendMessage}
                    uploadFile={client?.uploadFile}
                    composerPlaceholder="Type a message..."
                />
            </Container>

            {/* Floating Action Button */}
            <Fab
                onClick={toggleWebchat}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '64px',
                    height: '64px',
                    background:
                        'linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(147,51,234,1) 100%)',
                    color: 'white',
                    zIndex: 9999,
                }}
            />
        </>
    )
}

export default FloatingChat
