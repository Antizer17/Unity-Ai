import type {
  User,
  Lecture,
  Transcript,
  TranscriptSegment,
  Note,
  NoteSection,
  ChatSession,
  ChatMessage,
} from '@/types';

// ─── Mock User ────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'user-001',
  email: 'sarah.chen@university.edu',
  name: 'Sarah Chen',
  role: 'STUDENT',
  avatarUrl: undefined,
  createdAt: '2026-01-15T08:30:00Z',
};

// ─── Mock Lectures ────────────────────────────────────────────────────────────

export const mockLectures: Lecture[] = [
  {
    id: 'lec-001',
    title: 'Introduction to Neural Networks',
    description:
      'A comprehensive overview of artificial neural networks, covering perceptrons, activation functions, backpropagation, and gradient descent. This lecture lays the foundation for understanding modern deep learning architectures.',
    fileUrl: '/uploads/neural-networks-intro.mp4',
    thumbnailUrl: undefined,
    duration: 3420, // 57 minutes
    status: 'READY',
    userId: 'user-001',
    createdAt: '2026-06-10T14:00:00Z',
    updatedAt: '2026-06-10T15:05:00Z',
  },
  {
    id: 'lec-002',
    title: 'Quantum Computing Fundamentals',
    description:
      'Explore the basics of quantum computing including qubits, superposition, entanglement, and quantum gates. Includes practical examples of quantum algorithms like Grover\'s search.',
    fileUrl: '/uploads/quantum-computing.mp4',
    thumbnailUrl: undefined,
    duration: 4560, // 76 minutes
    status: 'READY',
    userId: 'user-001',
    createdAt: '2026-06-08T09:00:00Z',
    updatedAt: '2026-06-08T10:30:00Z',
  },
  {
    id: 'lec-003',
    title: 'Advanced Data Structures: B-Trees & Tries',
    description:
      'Deep dive into B-Trees, Tries, and their applications in databases and search engines. Covers insertion, deletion, and search complexity analysis.',
    fileUrl: '/uploads/data-structures-advanced.mp3',
    thumbnailUrl: undefined,
    duration: 2700, // 45 minutes
    status: 'PROCESSING',
    userId: 'user-001',
    createdAt: '2026-06-14T11:00:00Z',
    updatedAt: '2026-06-14T11:00:00Z',
  },
  {
    id: 'lec-004',
    title: 'Microeconomics: Supply and Demand',
    description:
      'Analysis of market equilibrium, price elasticity, consumer and producer surplus. Real-world case studies of market interventions and their effects.',
    fileUrl: '/uploads/microeconomics-supply-demand.mp4',
    thumbnailUrl: undefined,
    duration: 3900, // 65 minutes
    status: 'TRANSCRIBING',
    userId: 'user-001',
    createdAt: '2026-06-15T16:00:00Z',
    updatedAt: '2026-06-15T16:20:00Z',
  },
  {
    id: 'lec-005',
    title: 'Organic Chemistry: Reaction Mechanisms',
    description:
      'Covers SN1, SN2, E1, and E2 reaction mechanisms with detailed examples. Includes stereochemistry considerations and solvent effects on reaction pathways.',
    fileUrl: '/uploads/organic-chem-mechanisms.mp4',
    thumbnailUrl: undefined,
    duration: 5100, // 85 minutes
    status: 'FAILED',
    userId: 'user-001',
    createdAt: '2026-06-12T13:00:00Z',
    updatedAt: '2026-06-12T13:45:00Z',
  },
];

// ─── Mock Transcript ──────────────────────────────────────────────────────────

const neuralNetworkSegments: TranscriptSegment[] = [
  {
    id: 'seg-001',
    text: "Welcome everyone to today's lecture on neural networks. We'll start with the very basics and work our way up to understanding how modern deep learning systems are built.",
    startTime: 0,
    endTime: 12,
  },
  {
    id: 'seg-002',
    text: 'A neural network is essentially a mathematical function that maps inputs to outputs through a series of transformations. The fundamental unit is called a neuron, or perceptron, which was first introduced by Frank Rosenblatt in 1958.',
    startTime: 12,
    endTime: 28,
  },
  {
    id: 'seg-003',
    text: "Each neuron takes weighted inputs, sums them up, adds a bias term, and passes the result through an activation function. Think of it as a tiny decision-maker that fires when the combined signal exceeds a threshold.",
    startTime: 28,
    endTime: 45,
  },
  {
    id: 'seg-004',
    text: "Now, let's talk about activation functions. The simplest one is the step function — it outputs 1 if the input is above zero, and 0 otherwise. But in practice, we use smoother functions like sigmoid, tanh, and ReLU.",
    startTime: 45,
    endTime: 62,
  },
  {
    id: 'seg-005',
    text: 'ReLU, or Rectified Linear Unit, has become the most popular choice. It simply outputs the input if positive, and zero otherwise. Its simplicity makes it computationally efficient and helps mitigate the vanishing gradient problem.',
    startTime: 62,
    endTime: 80,
  },
  {
    id: 'seg-006',
    text: "When we stack multiple layers of neurons, we get what's called a multi-layer perceptron or a feed-forward neural network. The layers between input and output are called hidden layers, and having more of them makes the network 'deeper'.",
    startTime: 80,
    endTime: 98,
  },
  {
    id: 'seg-007',
    text: "The magic of neural networks comes from the training process. We use an algorithm called backpropagation, which calculates how much each weight contributed to the error, and then adjusts them accordingly.",
    startTime: 98,
    endTime: 115,
  },
  {
    id: 'seg-008',
    text: "Backpropagation works by computing gradients — the partial derivatives of the loss function with respect to each weight. We then use gradient descent to update the weights in the direction that minimizes the loss.",
    startTime: 115,
    endTime: 132,
  },
  {
    id: 'seg-009',
    text: "The learning rate is a crucial hyperparameter. Too high, and the network overshoots the minimum. Too low, and training takes forever. Modern optimizers like Adam adaptively adjust the learning rate for each parameter.",
    startTime: 132,
    endTime: 150,
  },
  {
    id: 'seg-010',
    text: "Let's look at a practical example. Say we want to classify handwritten digits using the MNIST dataset. Each image is 28 by 28 pixels, giving us 784 input features.",
    startTime: 150,
    endTime: 165,
  },
  {
    id: 'seg-011',
    text: "We'd create a network with 784 input neurons, maybe two hidden layers with 128 and 64 neurons respectively, and 10 output neurons — one for each digit class. The output layer uses softmax to produce probabilities.",
    startTime: 165,
    endTime: 182,
  },
  {
    id: 'seg-012',
    text: "With just this simple architecture and proper training, we can achieve over 98% accuracy on digit recognition. This demonstrates the remarkable power of even basic neural networks when applied to real problems.",
    startTime: 182,
    endTime: 200,
  },
];

export const mockTranscript: Transcript = {
  id: 'trans-001',
  lectureId: 'lec-001',
  fullText: neuralNetworkSegments.map((s) => s.text).join(' '),
  language: 'en',
  segments: neuralNetworkSegments,
};

// ─── Mock Notes ───────────────────────────────────────────────────────────────

const neuralNetworkSections: NoteSection[] = [
  {
    id: 'note-sec-001',
    title: 'Introduction to Neural Networks',
    content:
      '- Neural networks are mathematical functions that map inputs to outputs through transformations\n- Fundamental unit: **neuron** (perceptron), introduced by Frank Rosenblatt in 1958\n- Each neuron: weighted inputs → sum → bias → activation function',
    startTimestamp: 0,
    endTimestamp: 45,
    orderIndex: 0,
  },
  {
    id: 'note-sec-002',
    title: 'Activation Functions',
    content:
      '- **Step function**: simplest, binary output (0 or 1)\n- **Sigmoid**: smooth S-curve, outputs between 0 and 1\n- **Tanh**: similar to sigmoid but outputs between -1 and 1\n- **ReLU** (Rectified Linear Unit): most popular modern choice\n  - Output = max(0, input)\n  - Computationally efficient\n  - Mitigates vanishing gradient problem',
    startTimestamp: 45,
    endTimestamp: 80,
    orderIndex: 1,
  },
  {
    id: 'note-sec-003',
    title: 'Network Architecture',
    content:
      '- **Multi-layer perceptron (MLP)**: stacked layers of neurons\n- **Hidden layers**: layers between input and output\n- More hidden layers = "deeper" network\n- Feed-forward: data flows in one direction (input → output)',
    startTimestamp: 80,
    endTimestamp: 98,
    orderIndex: 2,
  },
  {
    id: 'note-sec-004',
    title: 'Backpropagation & Training',
    content:
      '- **Backpropagation**: calculates each weight\'s contribution to error\n- Computes **gradients** (partial derivatives of loss w.r.t. weights)\n- **Gradient descent**: updates weights to minimize loss function\n- **Learning rate**: critical hyperparameter\n  - Too high → overshoots minimum\n  - Too low → slow convergence\n- **Adam optimizer**: adaptively adjusts learning rate per parameter',
    startTimestamp: 98,
    endTimestamp: 150,
    orderIndex: 3,
  },
  {
    id: 'note-sec-005',
    title: 'Practical Example: MNIST Digit Classification',
    content:
      '- Dataset: 28×28 pixel handwritten digit images\n- Input: 784 features (flattened pixels)\n- Architecture: 784 → 128 → 64 → 10 neurons\n- Output layer: **softmax** for class probabilities\n- Achievable accuracy: **>98%** with basic architecture',
    startTimestamp: 150,
    endTimestamp: 200,
    orderIndex: 4,
  },
  {
    id: 'note-sec-006',
    title: 'Key Takeaways',
    content:
      '- Neural networks are universal function approximators\n- Architecture design (layers, neurons) affects model capacity\n- Training requires careful tuning of hyperparameters\n- Even simple networks can solve complex real-world problems\n- Foundation for more advanced architectures (CNNs, RNNs, Transformers)',
    startTimestamp: 0,
    endTimestamp: 200,
    orderIndex: 5,
  },
];

export const mockNotes: Note = {
  id: 'note-001',
  lectureId: 'lec-001',
  content: 'AI-generated structured notes for Introduction to Neural Networks',
  sections: neuralNetworkSections,
  generatedAt: '2026-06-10T15:00:00Z',
};

// ─── Mock Chat Session ────────────────────────────────────────────────────────

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: 'What is the difference between ReLU and sigmoid activation functions?',
    createdAt: '2026-06-10T15:30:00Z',
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content:
      "Great question! The key differences between ReLU and sigmoid are:\n\n1. **Output range**: Sigmoid outputs values between 0 and 1, while ReLU outputs either 0 (for negative inputs) or the input value itself.\n\n2. **Computational efficiency**: ReLU is much simpler to compute — it's just a max(0, x) operation, whereas sigmoid involves an exponential calculation.\n\n3. **Vanishing gradient**: Sigmoid can cause the vanishing gradient problem in deep networks because its gradients become very small for large positive or negative inputs. ReLU doesn't have this issue for positive values.\n\nAs mentioned in the lecture, ReLU has become the most popular choice in modern networks due to these advantages.",
    citations: [
      {
        segmentId: 'seg-004',
        text: "The simplest one is the step function — it outputs 1 if the input is above zero, and 0 otherwise. But in practice, we use smoother functions like sigmoid, tanh, and ReLU.",
        startTime: 45,
        endTime: 62,
      },
      {
        segmentId: 'seg-005',
        text: 'ReLU, or Rectified Linear Unit, has become the most popular choice. It simply outputs the input if positive, and zero otherwise.',
        startTime: 62,
        endTime: 80,
      },
    ],
    createdAt: '2026-06-10T15:30:05Z',
  },
  {
    id: 'msg-003',
    role: 'user',
    content: 'Can you explain backpropagation in simpler terms?',
    createdAt: '2026-06-10T15:32:00Z',
  },
  {
    id: 'msg-004',
    role: 'assistant',
    content:
      "Sure! Think of backpropagation like grading a group project:\n\n1. **Forward pass**: The network makes a prediction (like submitting the project)\n2. **Calculate error**: We see how wrong the prediction was (the grade)\n3. **Backward pass**: We figure out how much each team member (weight) contributed to the mistakes\n4. **Update**: Each member adjusts their contribution to do better next time\n\nThe \"backward\" part means we start from the output error and trace back through each layer, calculating how much each weight was responsible. Then we nudge each weight slightly in the direction that would reduce the error.\n\nThe professor explained it as computing gradients — the partial derivatives of the loss function with respect to each weight — and then using gradient descent to update them.",
    citations: [
      {
        segmentId: 'seg-007',
        text: "The magic of neural networks comes from the training process. We use an algorithm called backpropagation, which calculates how much each weight contributed to the error.",
        startTime: 98,
        endTime: 115,
      },
      {
        segmentId: 'seg-008',
        text: "Backpropagation works by computing gradients — the partial derivatives of the loss function with respect to each weight.",
        startTime: 115,
        endTime: 132,
      },
    ],
    createdAt: '2026-06-10T15:32:08Z',
  },
];

export const mockChatSession: ChatSession = {
  id: 'chat-001',
  lectureId: 'lec-001',
  messages: mockChatMessages,
  createdAt: '2026-06-10T15:30:00Z',
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockStats = {
  totalLectures: 12,
  hoursStudied: 34.5,
  notesGenerated: 9,
  chatSessions: 27,
};
