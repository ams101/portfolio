interface ChatRequest {
  session_id: string;
  user: { phone: string; name: string };
  message: string;
}

interface ChatResponse {
  reply: string;
  session_id: string;
  ui?: {
    chips?: string[];
    cards?: Array<{
      title: string;
      subtitle: string;
      actionText: string;
      actionPayload: string;
    }>;
    linkPreview?: {
      url: string;
      title: string;
      description: string;
    };
  };
  debug?: {
    intent: string;
    state: string;
    toolCalls: string[];
  };
}

interface Session {
  id: string;
  userId: string;
  state: string;
  context: Record<string, unknown>;
  strikes: number;
  active: boolean;
}

interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  placeId: string;
  placeName: string;
  checkin: string;
  checkout: string;
  roomType: string;
  guests: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
  totalAmount: number;
}

interface Payment {
  id: string;
  paymentRef: string;
  bookingId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: number;
}

const PROFANITY_WORDS = ['fuck', 'shit', 'damn', 'hell', 'ass', 'bitch', 'bastard', 'crap'];

const FAQS = {
  'check-in time': 'Check-in time is 2:00 PM. Early check-in subject to availability.',
  'check-out time': 'Check-out time is 11:00 AM. Late check-out may incur additional charges.',
  'id requirements': 'Valid government-issued photo ID required at check-in (Passport, National ID, or Emirates ID).',
  'cancellation policy': 'Free cancellation if >48h before check-in. 48-24h: charge 1 night. <24h: no refund.',
  'refund timeline': 'Refunds are processed within 3-5 business days to the original payment method.',
  'room types': 'We offer Mixed Dorm (shared), Female Dorm (women only), and Private Room (single/double occupancy).',
  'wifi': 'Free high-speed WiFi available throughout the property.',
  'parking': 'Free parking available for guests. Subject to availability.',
  'pets': 'Sorry, pets are not allowed in our properties.',
  'smoking': 'All our properties are non-smoking. Smoking areas available outside.'
};

const PLACES = [
  { id: '1', name: 'Place 1', description: 'Beachfront paradise' },
  { id: '2', name: 'Place 2', description: 'Mountain retreat' },
  { id: '3', name: 'Place 3', description: 'City center hub' },
  { id: '4', name: 'Place 4', description: 'Desert oasis' },
  { id: '5', name: 'Place 5', description: 'Lakeside escape' }
];

const ROOM_TYPES = ['Mixed Dorm', 'Female Dorm', 'Private Room'];

export class TravelAssistant {
  private sessions: Map<string, Session> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private payments: Map<string, Payment> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('wa_assistant_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.sessions = new Map(data.sessions || []);
        this.bookings = new Map(data.bookings || []);
        this.payments = new Map(data.payments || []);
      }
    } catch (e) {
      console.error('Failed to load assistant data', e);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        sessions: Array.from(this.sessions.entries()),
        bookings: Array.from(this.bookings.entries()),
        payments: Array.from(this.payments.entries())
      };
      localStorage.setItem('wa_assistant_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save assistant data', e);
    }
  }

  private getOrCreateSession(sessionId: string, userId: string): Session {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        userId,
        state: 'IDLE',
        context: {},
        strikes: 0,
        active: true
      });
      this.saveToStorage();
    }
    return this.sessions.get(sessionId)!;
  }

  private updateSession(sessionId: string, updates: Partial<Session>) {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.saveToStorage();
    }
  }

  private generateRef(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  private checkProfanity(message: string): boolean {
    const lower = message.toLowerCase();
    return PROFANITY_WORDS.some(word => lower.includes(word));
  }

  private parseDate(dateStr: string): Date | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lower = dateStr.toLowerCase();

    if (lower.includes('tomorrow')) {
      const date = new Date(today);
      date.setDate(date.getDate() + 1);
      return date;
    }

    if (lower.includes('next weekend')) {
      const date = new Date(today);
      const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
      date.setDate(date.getDate() + daysUntilSaturday);
      return date;
    }

    const dateMatch = dateStr.match(/(\d{1,2})[\/-](\d{1,2})/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1]) - 1;
      const day = parseInt(dateMatch[2]);
      const date = new Date(today.getFullYear(), month, day);
      if (date < today) {
        date.setFullYear(date.getFullYear() + 1);
      }
      return date;
    }

    return null;
  }

  private extractIntent(message: string): {
    intent: string;
    entities: Record<string, string | number>;
  } {
    const lower = message.toLowerCase();
    const entities: Record<string, string | number> = {};

    if (lower.includes('payment_success') || lower.includes('payment_failed')) {
      return {
        intent: lower.includes('success') ? 'payment_success' : 'payment_failed',
        entities: {}
      };
    }

    if (lower.includes('book') || lower.includes('reservation')) {
      PLACES.forEach(place => {
        if (lower.includes(place.name.toLowerCase())) {
          entities.place = place.name;
        }
      });

      ROOM_TYPES.forEach(type => {
        if (lower.includes(type.toLowerCase())) {
          entities.roomType = type;
        }
      });

      const guestMatch = message.match(/(\d+)\s*(guest|person|people|pax)/i);
      if (guestMatch) {
        entities.guests = parseInt(guestMatch[1]);
      }

      return { intent: 'booking', entities };
    }

    if (lower.includes('modify') || lower.includes('change') || lower.includes('update')) {
      return { intent: 'modification', entities };
    }

    if (lower.includes('cancel')) {
      const refMatch = message.match(/BK-[A-Z0-9]+/i);
      if (refMatch) {
        entities.bookingRef = refMatch[0].toUpperCase();
      }
      return { intent: 'cancellation', entities };
    }

    if (lower.includes('feedback') || lower.includes('review')) {
      return { intent: 'feedback', entities };
    }

    if (lower.includes('complain') || lower.includes('issue') || lower.includes('problem') || lower.includes('help') || lower.includes('human')) {
      return { intent: 'complaint', entities };
    }

    if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('thanks') || lower.includes('thank you')) {
      return { intent: 'goodbye', entities };
    }

    if (lower.includes('select_option_')) {
      const optionMatch = message.match(/SELECT_OPTION_([A-Z])/);
      if (optionMatch) {
        entities.option = optionMatch[1];
      }
      return { intent: 'booking_confirm', entities };
    }

    for (const [key, answer] of Object.entries(FAQS)) {
      if (lower.includes(key) || lower.includes(answer.toLowerCase().substring(0, 15))) {
        entities.faqKey = key;
        return { intent: 'faq', entities };
      }
    }

    return { intent: 'unknown', entities };
  }

  private generateRoomOptions(place: string, roomType?: string): Array<{
    title: string;
    subtitle: string;
    actionText: string;
    actionPayload: string;
  }> {
    const types = roomType ? [roomType] : ROOM_TYPES;
    const options = types.slice(0, 3).map((type, idx) => {
      const basePrice = type === 'Mixed Dorm' ? 800 : type === 'Female Dorm' ? 900 : 2400;
      const priceVariation = Math.floor(Math.random() * 200);
      const price = basePrice + priceVariation;
      const nights = 2;
      const total = price * nights;

      return {
        title: type,
        subtitle: `₹${price.toLocaleString()}/night • Total ₹${total.toLocaleString()} for ${nights} nights`,
        actionText: `Select ${String.fromCharCode(65 + idx)}`,
        actionPayload: `SELECT_OPTION_${String.fromCharCode(65 + idx)}`
      };
    });

    return options;
  }

  private calculateRefund(checkin: string): { amount: number; policy: string } {
    const checkinDate = new Date(checkin);
    const now = new Date();
    const hoursUntilCheckin = (checkinDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckin > 48) {
      return { amount: 100, policy: 'free cancellation (>48h before check-in)' };
    } else if (hoursUntilCheckin > 24) {
      return { amount: 50, policy: '1 night charged (48-24h before check-in)' };
    } else {
      return { amount: 0, policy: 'no refund (<24h before check-in)' };
    }
  }

  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    const session = this.getOrCreateSession(request.session_id, request.user.phone);

    if (!session.active) {
      return {
        reply: '⛔ Session has been terminated due to policy violations. Please refresh to start a new session.',
        session_id: request.session_id
      };
    }

    if (this.checkProfanity(request.message)) {
      session.strikes += 1;
      this.updateSession(request.session_id, { strikes: session.strikes });

      if (session.strikes === 1) {
        return {
          reply: '⚠️ Please maintain respectful communication. This is your first warning.',
          session_id: request.session_id,
          ui: { chips: ['I understand', 'Sorry'] }
        };
      } else if (session.strikes === 2) {
        return {
          reply: '⚠️⚠️ Final warning. Any further inappropriate language will end this session.',
          session_id: request.session_id,
          ui: { chips: ['I understand'] }
        };
      } else {
        this.updateSession(request.session_id, { active: false });
        return {
          reply: '🚫 Zo Zo! Session terminated due to repeated policy violations. Thank you.',
          session_id: request.session_id
        };
      }
    }

    const { intent, entities } = this.extractIntent(request.message);

    if (intent === 'payment_success') {
      const paymentRef = request.message.split(' ').pop() || '';
      const payment = Array.from(this.payments.values()).find(p => p.paymentRef === paymentRef);
      if (payment) {
        payment.status = 'SUCCESS';
        const booking = this.bookings.get(payment.bookingId);
        if (booking) {
          booking.status = 'CONFIRMED';
          this.saveToStorage();

          return {
            reply: `✅ Payment successful!\n\n🎉 Booking confirmed!\n\nBooking Reference: ${booking.bookingRef}\nPlace: ${booking.placeName}\nCheck-in: ${booking.checkin}\nCheck-out: ${booking.checkout}\nRoom: ${booking.roomType}\nGuests: ${booking.guests}\n\nYou'll receive a confirmation email shortly. Have a great stay!`,
            session_id: request.session_id,
            ui: {
              chips: ['Book another', 'View policy', 'Help']
            }
          };
        }
      }
    }

    if (intent === 'payment_failed') {
      return {
        reply: '❌ Payment failed. Would you like to try again?',
        session_id: request.session_id,
        ui: {
          chips: ['Retry payment', 'Cancel booking', 'Help']
        }
      };
    }

    if (intent === 'booking') {
      if (session.state === 'BOOKING_AWAITING_CONFIRMATION' && entities.option) {
        const context = session.context as Record<string, unknown>;
        const optionIndex = entities.option.toString().charCodeAt(0) - 65;
        const options = context.roomOptions as Array<{ title: string; subtitle: string }>;

        if (options && options[optionIndex]) {
          const selectedRoom = options[optionIndex];
          const roomType = selectedRoom.title;
          const totalMatch = selectedRoom.subtitle.match(/Total ₹([\d,]+)/);
          const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : 5000;

          const bookingId = this.generateRef('BOOK');
          const bookingRef = this.generateRef('BK');
          const paymentRef = this.generateRef('PAY');

          const booking: Booking = {
            id: bookingId,
            bookingRef,
            userId: request.user.phone,
            placeId: context.place as string || '1',
            placeName: context.place as string || 'Place 1',
            checkin: context.checkin as string || new Date().toISOString().split('T')[0],
            checkout: context.checkout as string || new Date().toISOString().split('T')[0],
            roomType,
            guests: context.guests as number || 2,
            status: 'PENDING_PAYMENT',
            totalAmount: total
          };

          const payment: Payment = {
            id: this.generateRef('PMNT'),
            paymentRef,
            bookingId,
            status: 'PENDING',
            amount: total
          };

          this.bookings.set(bookingId, booking);
          this.payments.set(payment.id, payment);
          this.saveToStorage();

          this.updateSession(request.session_id, {
            state: 'BOOKING_PAYMENT_PENDING',
            context: { ...context, bookingId, paymentRef }
          });

          return {
            reply: `Perfect! I've reserved ${roomType} at ${booking.placeName}.\n\nTotal: ₹${total.toLocaleString()}\n\nPlease complete the payment to confirm your booking.`,
            session_id: request.session_id,
            ui: {
              linkPreview: {
                url: `https://demo.local/pay/${paymentRef}`,
                title: 'Complete Payment',
                description: `Pay ₹${total.toLocaleString()} to confirm booking`
              }
            }
          };
        }
      }

      const place = entities.place as string || 'Place 2';
      const roomType = entities.roomType as string;
      const guests = entities.guests as number || 2;

      const options = this.generateRoomOptions(place, roomType);

      this.updateSession(request.session_id, {
        state: 'BOOKING_AWAITING_CONFIRMATION',
        context: { place, roomType, guests, roomOptions: options, checkin: '2025-01-15', checkout: '2025-01-17' }
      });

      return {
        reply: `Great! I found these options at ${place} for ${guests} guest${guests > 1 ? 's' : ''}:\n\nCheck-in: Jan 15, 2025\nCheck-out: Jan 17, 2025 (2 nights)\n\nPlease select your preferred option:`,
        session_id: request.session_id,
        ui: { cards: options }
      };
    }

    if (intent === 'modification') {
      const userBookings = Array.from(this.bookings.values()).filter(
        b => b.userId === request.user.phone && b.status === 'CONFIRMED'
      );

      if (userBookings.length === 0) {
        return {
          reply: 'I couldn\'t find any confirmed bookings for your account. Would you like to make a new booking?',
          session_id: request.session_id,
          ui: { chips: ['Book a stay', 'Help'] }
        };
      }

      const booking = userBookings[0];
      return {
        reply: `I found your booking:\n\nRef: ${booking.bookingRef}\nPlace: ${booking.placeName}\nCheck-in: ${booking.checkin}\nRoom: ${booking.roomType}\nGuests: ${booking.guests}\n\nWhat would you like to modify?`,
        session_id: request.session_id,
        ui: { chips: ['Change dates', 'Change room', 'Add guests', 'Cancel'] }
      };
    }

    if (intent === 'cancellation') {
      const bookingRef = entities.bookingRef as string;
      let booking: Booking | undefined;

      if (bookingRef) {
        booking = Array.from(this.bookings.values()).find(b => b.bookingRef === bookingRef);
      } else {
        const userBookings = Array.from(this.bookings.values()).filter(
          b => b.userId === request.user.phone && b.status === 'CONFIRMED'
        );
        booking = userBookings[0];
      }

      if (!booking) {
        return {
          reply: 'I couldn\'t find that booking. Please provide your booking reference (e.g., BK-ABC123).',
          session_id: request.session_id,
          ui: { chips: ['View my bookings', 'Help'] }
        };
      }

      if (session.state === 'CANCELLATION_CONFIRM' && request.message.toUpperCase() === 'CANCEL') {
        booking.status = 'CANCELLED';
        this.saveToStorage();

        const refund = this.calculateRefund(booking.checkin);

        return {
          reply: `✅ Booking ${booking.bookingRef} has been cancelled.\n\nRefund: ${refund.amount}% of total amount\nPolicy: ${refund.policy}\n\nYou'll receive the refund in 3-5 business days.`,
          session_id: request.session_id,
          ui: { chips: ['Book again', 'Help'] }
        };
      }

      const refund = this.calculateRefund(booking.checkin);

      this.updateSession(request.session_id, {
        state: 'CANCELLATION_CONFIRM',
        context: { bookingRef: booking.bookingRef }
      });

      return {
        reply: `⚠️ Cancellation Details:\n\nBooking: ${booking.bookingRef}\nPlace: ${booking.placeName}\nAmount: ₹${booking.totalAmount.toLocaleString()}\n\nRefund: ${refund.amount}% (${refund.policy})\n\n⚠️ To confirm cancellation, type: CANCEL`,
        session_id: request.session_id,
        ui: { chips: ['CANCEL', 'Keep booking'] }
      };
    }

    if (intent === 'faq') {
      const faqKey = entities.faqKey as string;
      const answer = FAQS[faqKey as keyof typeof FAQS];

      return {
        reply: answer,
        session_id: request.session_id,
        ui: {
          chips: ['Book a stay', 'More questions', 'Thanks']
        }
      };
    }

    if (intent === 'feedback') {
      return {
        reply: '📝 Thank you for your feedback! Your input helps us improve. Your feedback has been recorded.',
        session_id: request.session_id,
        ui: { chips: ['Book a stay', 'Help'] }
      };
    }

    if (intent === 'complaint') {
      return {
        reply: '🎧 I understand you need assistance. I\'ve created a support ticket and our team will reach out shortly.\n\nTicket #' + this.generateRef('TKT'),
        session_id: request.session_id,
        ui: { chips: ['Thanks', 'Urgent issue'] }
      };
    }

    if (intent === 'goodbye') {
      return {
        reply: '👋 Zo Zo! Thanks for chatting with me. Have a great day!',
        session_id: request.session_id
      };
    }

    return {
      reply: 'I can help you with:\n\n📅 Booking stays\n✏️ Modifying bookings\n❌ Cancellations\n❓ FAQs (check-in times, policies, etc.)\n💬 Feedback & complaints\n\nWhat would you like to do?',
      session_id: request.session_id,
      ui: {
        chips: ['Book a stay', 'Modify booking', 'Cancel booking', 'Help']
      }
    };
  }

  getPendingPaymentAmount(paymentRef: string): number {
    const payment = Array.from(this.payments.values()).find(p => p.paymentRef === paymentRef);
    return payment?.amount || 0;
  }
}
