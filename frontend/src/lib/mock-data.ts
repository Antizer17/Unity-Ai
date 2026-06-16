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
    fileUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
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
    { id: 'seg-000', text: "This is a 3.", startTime: 4, endTime: 5 },
    { id: 'seg-001', text: "It's sloppily written and rendered at an extremely low resolution of 28x28 pixels,", startTime: 6, endTime: 10 },
    { id: 'seg-002', text: "but your brain has no trouble recognizing it as a 3.", startTime: 10, endTime: 13 },
    { id: 'seg-003', text: "And I want you to take a moment to appreciate how", startTime: 14, endTime: 16 },
    { id: 'seg-004', text: "crazy it is that brains can do this so effortlessly.", startTime: 16, endTime: 18 },
    { id: 'seg-005', text: "I mean, this, this and this are also recognizable as 3s,", startTime: 19, endTime: 22 },
    { id: 'seg-006', text: "even though the specific values of each pixel is very different from one", startTime: 22, endTime: 27 },
    { id: 'seg-007', text: "image to the next.", startTime: 27, endTime: 28 },
    { id: 'seg-008', text: "The particular light-sensitive cells in your eye that are firing when you", startTime: 28, endTime: 32 },
    { id: 'seg-009', text: "see this 3 are very different from the ones firing when you see this 3.", startTime: 32, endTime: 36 },
    { id: 'seg-010', text: "But something in that crazy-smart visual cortex of yours resolves these as representing", startTime: 37, endTime: 42 },
    { id: 'seg-011', text: "the same idea, while at the same time recognizing other images as their own distinct", startTime: 42, endTime: 47 },
    { id: 'seg-012', text: "ideas.", startTime: 47, endTime: 48 },
    { id: 'seg-013', text: "But if I told you, hey, sit down and write for me a program that takes in a grid of", startTime: 49, endTime: 54 },
    { id: 'seg-014', text: "28x28 pixels like this and outputs a single number between 0 and 10,", startTime: 54, endTime: 59 },
    { id: 'seg-015', text: "telling you what it thinks the digit is, well the task goes from comically trivial to", startTime: 59, endTime: 64 },
    { id: 'seg-016', text: "dauntingly difficult.", startTime: 64, endTime: 66 },
    { id: 'seg-017', text: "Unless you've been living under a rock, I think I hardly need to motivate the relevance", startTime: 67, endTime: 70 },
    { id: 'seg-018', text: "and importance of machine learning and neural networks to the present and to the future.", startTime: 70, endTime: 74 },
    { id: 'seg-019', text: "But what I want to do here is show you what a neural network actually is,", startTime: 75, endTime: 78 },
    { id: 'seg-020', text: "assuming no background, and to help visualize what it's doing,", startTime: 78, endTime: 82 },
    { id: 'seg-021', text: "not as a buzzword but as a piece of math.", startTime: 82, endTime: 84 },
    { id: 'seg-022', text: "My hope is that you come away feeling like the structure itself is motivated,", startTime: 85, endTime: 88 },
    { id: 'seg-023', text: "and to feel like you know what it means when you read,", startTime: 88, endTime: 91 },
    { id: 'seg-024', text: "or you hear about a neural network quote-unquote learning.", startTime: 91, endTime: 94 },
    { id: 'seg-025', text: "This video is just going to be devoted to the structure component of that,", startTime: 95, endTime: 98 },
    { id: 'seg-026', text: "and the following one is going to tackle learning.", startTime: 98, endTime: 100 },
    { id: 'seg-027', text: "What we're going to do is put together a neural", startTime: 100, endTime: 103 },
    { id: 'seg-028', text: "network that can learn to recognize handwritten digits.", startTime: 103, endTime: 106 },
    { id: 'seg-029', text: "This is a somewhat classic example for introducing the topic,", startTime: 109, endTime: 112 },
    { id: 'seg-030', text: "and I'm happy to stick with the status quo here,", startTime: 112, endTime: 114 },
    { id: 'seg-031', text: "because at the end of the two videos I want to point you to a couple good", startTime: 114, endTime: 117 },
    { id: 'seg-032', text: "resources where you can learn more, and where you can download the code that", startTime: 117, endTime: 120 },
    { id: 'seg-033', text: "does this and play with it on your own computer.", startTime: 120, endTime: 123 },
    { id: 'seg-034', text: "There are many many variants of neural networks,", startTime: 125, endTime: 127 },
    { id: 'seg-035', text: "and in recent years there's been sort of a boom in research towards these variants,", startTime: 127, endTime: 132 },
    { id: 'seg-036', text: "but in these two introductory videos you and I are just going to look at the simplest", startTime: 132, endTime: 136 },
    { id: 'seg-037', text: "plain vanilla form with no added frills.", startTime: 136, endTime: 139 },
    { id: 'seg-038', text: "This is kind of a necessary prerequisite for understanding any of the more powerful", startTime: 139, endTime: 143 },
    { id: 'seg-039', text: "modern variants, and trust me it still has plenty of complexity for us to wrap our minds", startTime: 143, endTime: 148 },
    { id: 'seg-040', text: "around.", startTime: 148, endTime: 148 },
    { id: 'seg-041', text: "But even in this simplest form it can learn to recognize handwritten digits,", startTime: 149, endTime: 153 },
    { id: 'seg-042', text: "which is a pretty cool thing for a computer to be able to do.", startTime: 153, endTime: 156 },
    { id: 'seg-043', text: "And at the same time you'll see how it does fall", startTime: 157, endTime: 159 },
    { id: 'seg-044', text: "short of a couple hopes that we might have for it.", startTime: 159, endTime: 162 },
    { id: 'seg-045', text: "As the name suggests neural networks are inspired by the brain, but let's break that down.", startTime: 163, endTime: 168 },
    { id: 'seg-046', text: "What are the neurons, and in what sense are they linked together?", startTime: 168, endTime: 171 },
    { id: 'seg-047', text: "Right now when I say neuron all I want you to think about is a thing that holds a number,", startTime: 172, endTime: 178 },
    { id: 'seg-048', text: "specifically a number between 0 and 1.", startTime: 178, endTime: 180 },
    { id: 'seg-049', text: "It's really not more than that.", startTime: 180, endTime: 182 },
    { id: 'seg-050', text: "For example the network starts with a bunch of neurons corresponding to", startTime: 183, endTime: 188 },
    { id: 'seg-051', text: "each of the 28x28 pixels of the input image, which is 784 neurons in total.", startTime: 188, endTime: 194 },
    { id: 'seg-052', text: "Each one of these holds a number that represents the grayscale value of the", startTime: 194, endTime: 199 },
    { id: 'seg-053', text: "corresponding pixel, ranging from 0 for black pixels up to 1 for white pixels.", startTime: 199, endTime: 204 },
    { id: 'seg-054', text: "This number inside the neuron is called its activation,", startTime: 205, endTime: 208 },
    { id: 'seg-055', text: "and the image you might have in mind here is that each neuron is lit up when its", startTime: 208, endTime: 212 },
    { id: 'seg-056', text: "activation is a high number.", startTime: 212, endTime: 214 },
    { id: 'seg-057', text: "So all of these 784 neurons make up the first layer of our network.", startTime: 216, endTime: 221 },
    { id: 'seg-058', text: "Now jumping over to the last layer, this has 10 neurons,", startTime: 226, endTime: 229 },
    { id: 'seg-059', text: "each representing one of the digits.", startTime: 229, endTime: 231 },
    { id: 'seg-060', text: "The activation in these neurons, again some number that's between 0 and 1,", startTime: 232, endTime: 236 },
    { id: 'seg-061', text: "represents how much the system thinks that a given image corresponds with a given digit.", startTime: 236, endTime: 242 },
    { id: 'seg-062', text: "There's also a couple layers in between called the hidden layers,", startTime: 243, endTime: 246 },
    { id: 'seg-063', text: "which for the time being should just be a giant question mark for", startTime: 246, endTime: 249 },
    { id: 'seg-064', text: "how on earth this process of recognizing digits is going to be handled.", startTime: 249, endTime: 253 },
    { id: 'seg-065', text: "In this network I chose two hidden layers, each one with 16 neurons,", startTime: 254, endTime: 257 },
    { id: 'seg-066', text: "and admittedly that's kind of an arbitrary choice.", startTime: 257, endTime: 260 },
    { id: 'seg-067', text: "To be honest I chose two layers based on how I want to motivate the structure in", startTime: 261, endTime: 264 },
    { id: 'seg-068', text: "just a moment, and 16, well that was just a nice number to fit on the screen.", startTime: 264, endTime: 268 },
    { id: 'seg-069', text: "In practice there is a lot of room for experiment with a specific structure here.", startTime: 268, endTime: 272 },
    { id: 'seg-070', text: "The way the network operates, activations in one", startTime: 273, endTime: 275 },
    { id: 'seg-071', text: "layer determine the activations of the next layer.", startTime: 275, endTime: 278 },
    { id: 'seg-072', text: "And of course the heart of the network as an information processing mechanism comes down", startTime: 279, endTime: 283 },
    { id: 'seg-073', text: "to exactly how those activations from one layer bring about activations in the next", startTime: 283, endTime: 288 },
    { id: 'seg-074', text: "layer.", startTime: 288, endTime: 288 },
    { id: 'seg-075', text: "It's meant to be loosely analogous to how in biological networks of neurons,", startTime: 289, endTime: 293 },
    { id: 'seg-076', text: "some groups of neurons firing cause certain others to fire.", startTime: 293, endTime: 297 },
    { id: 'seg-077', text: "Now the network I'm showing here has already been trained to recognize digits,", startTime: 298, endTime: 301 },
    { id: 'seg-078', text: "and let me show you what I mean by that.", startTime: 301, endTime: 303 },
    { id: 'seg-079', text: "It means if you feed in an image, lighting up all 784 neurons of the input layer", startTime: 303, endTime: 308 },
    { id: 'seg-080', text: "according to the brightness of each pixel in the image,", startTime: 308, endTime: 311 },
    { id: 'seg-081', text: "that pattern of activations causes some very specific pattern in the next layer", startTime: 311, endTime: 316 },
    { id: 'seg-082', text: "which causes some pattern in the one after it,", startTime: 316, endTime: 318 },
    { id: 'seg-083', text: "which finally gives some pattern in the output layer.", startTime: 318, endTime: 322 },
    { id: 'seg-084', text: "And the brightest neuron of that output layer is the network's choice,", startTime: 322, endTime: 326 },
    { id: 'seg-085', text: "so to speak, for what digit this image represents.", startTime: 326, endTime: 329 },
    { id: 'seg-086', text: "And before jumping into the math for how one layer influences the next,", startTime: 332, endTime: 336 },
    { id: 'seg-087', text: "or how training works, let's just talk about why it's even reasonable", startTime: 336, endTime: 340 },
    { id: 'seg-088', text: "to expect a layered structure like this to behave intelligently.", startTime: 340, endTime: 343 },
    { id: 'seg-089', text: "What are we expecting here?", startTime: 344, endTime: 345 },
    { id: 'seg-090', text: "What is the best hope for what those middle layers might be doing?", startTime: 345, endTime: 347 },
    { id: 'seg-091', text: "Well, when you or I recognize digits, we piece together various components.", startTime: 348, endTime: 353 },
    { id: 'seg-092', text: "A 9 has a loop up top and a line on the right.", startTime: 354, endTime: 356 },
    { id: 'seg-093', text: "An 8 also has a loop up top, but it's paired with another loop down low.", startTime: 357, endTime: 361 },
    { id: 'seg-094', text: "A 4 basically breaks down into three specific lines, and things like that.", startTime: 361, endTime: 366 },
    { id: 'seg-095', text: "Now in a perfect world, we might hope that each neuron in the second", startTime: 367, endTime: 371 },
    { id: 'seg-096', text: "to last layer corresponds with one of these subcomponents,", startTime: 371, endTime: 374 },
    { id: 'seg-097', text: "that anytime you feed in an image with, say, a loop up top,", startTime: 374, endTime: 378 },
    { id: 'seg-098', text: "like a 9 or an 8, there's some specific neuron whose activation is", startTime: 378, endTime: 382 },
    { id: 'seg-099', text: "going to be close to 1.", startTime: 382, endTime: 383 },
    { id: 'seg-100', text: "And I don't mean this specific loop of pixels,", startTime: 384, endTime: 386 },
    { id: 'seg-101', text: "the hope would be that any generally loopy pattern towards the top sets off this neuron.", startTime: 386, endTime: 391 },
    { id: 'seg-102', text: "That way, going from the third layer to the last one just requires", startTime: 392, endTime: 396 },
    { id: 'seg-103', text: "learning which combination of subcomponents corresponds to which digits.", startTime: 396, endTime: 400 },
    { id: 'seg-104', text: "Of course, that just kicks the problem down the road,", startTime: 401, endTime: 403 },
    { id: 'seg-105', text: "because how would you recognize these subcomponents,", startTime: 403, endTime: 405 },
    { id: 'seg-106', text: "or even learn what the right subcomponents should be?", startTime: 405, endTime: 407 },
    { id: 'seg-107', text: "And I still haven't even talked about how one layer influences the next,", startTime: 408, endTime: 411 },
    { id: 'seg-108', text: "but run with me on this one for a moment.", startTime: 411, endTime: 413 },
    { id: 'seg-109', text: "Recognizing a loop can also break down into subproblems.", startTime: 413, endTime: 416 },
    { id: 'seg-110', text: "One reasonable way to do this would be to first", startTime: 417, endTime: 419 },
    { id: 'seg-111', text: "recognize the various little edges that make it up.", startTime: 419, endTime: 422 },
    { id: 'seg-112', text: "Similarly, a long line, like the kind you might see in the digits 1 or 4 or 7,", startTime: 423, endTime: 428 },
    { id: 'seg-113', text: "is really just a long edge, or maybe you think of it as a certain pattern of several", startTime: 428, endTime: 433 },
    { id: 'seg-114', text: "smaller edges.", startTime: 433, endTime: 434 },
    { id: 'seg-115', text: "So maybe our hope is that each neuron in the second layer of", startTime: 435, endTime: 438 },
    { id: 'seg-116', text: "the network corresponds with the various relevant little edges.", startTime: 438, endTime: 442 },
    { id: 'seg-117', text: "Maybe when an image like this one comes in, it lights up all of the", startTime: 443, endTime: 447 },
    { id: 'seg-118', text: "neurons associated with around 8 to 10 specific little edges,", startTime: 447, endTime: 451 },
    { id: 'seg-119', text: "which in turn lights up the neurons associated with the upper loop", startTime: 451, endTime: 455 },
    { id: 'seg-120', text: "and a long vertical line, and those light up the neuron associated with a 9.", startTime: 455, endTime: 459 },
    { id: 'seg-121', text: "Whether or not this is what our final network actually does is another question,", startTime: 460, endTime: 464 },
    { id: 'seg-122', text: "one that I'll come back to once we see how to train the network,", startTime: 464, endTime: 467 },
    { id: 'seg-123', text: "but this is a hope that we might have, a sort of goal with the layered structure", startTime: 467, endTime: 471 },
    { id: 'seg-124', text: "like this.", startTime: 471, endTime: 472 },
    { id: 'seg-125', text: "Moreover, you can imagine how being able to detect edges and patterns", startTime: 473, endTime: 476 },
    { id: 'seg-126', text: "like this would be really useful for other image recognition tasks.", startTime: 476, endTime: 480 },
    { id: 'seg-127', text: "And even beyond image recognition, there are all sorts of intelligent", startTime: 480, endTime: 484 },
    { id: 'seg-128', text: "things you might want to do that break down into layers of abstraction.", startTime: 484, endTime: 487 },
    { id: 'seg-129', text: "Parsing speech, for example, involves taking raw audio and picking out distinct sounds,", startTime: 488, endTime: 492 },
    { id: 'seg-130', text: "which combine to make certain syllables, which combine to form words,", startTime: 492, endTime: 496 },
    { id: 'seg-131', text: "which combine to make up phrases and more abstract thoughts, etc.", startTime: 496, endTime: 500 },
    { id: 'seg-132', text: "But getting back to how any of this actually works,", startTime: 501, endTime: 503 },
    { id: 'seg-133', text: "picture yourself right now designing how exactly the activations in one layer might", startTime: 503, endTime: 507 },
    { id: 'seg-134', text: "determine the activations in the next.", startTime: 507, endTime: 509 },
    { id: 'seg-135', text: "The goal is to have some mechanism that could conceivably combine pixels into edges,", startTime: 510, endTime: 515 },
    { id: 'seg-136', text: "or edges into patterns, or patterns into digits.", startTime: 515, endTime: 518 },
    { id: 'seg-137', text: "And to zoom in on one very specific example, let's say the hope", startTime: 519, endTime: 523 },
    { id: 'seg-138', text: "is for one particular neuron in the second layer to pick up", startTime: 523, endTime: 526 },
    { id: 'seg-139', text: "on whether or not the image has an edge in this region here.", startTime: 526, endTime: 530 },
    { id: 'seg-140', text: "The question at hand is what parameters should the network have?", startTime: 531, endTime: 535 },
    { id: 'seg-141', text: "What dials and knobs should you be able to tweak so that it's expressive", startTime: 535, endTime: 539 },
    { id: 'seg-142', text: "enough to potentially capture this pattern, or any other pixel pattern,", startTime: 539, endTime: 543 },
    { id: 'seg-143', text: "or the pattern that several edges can make a loop, and other such things?", startTime: 543, endTime: 547 },
    { id: 'seg-144', text: "Well, what we'll do is assign a weight to each one of the", startTime: 548, endTime: 551 },
    { id: 'seg-145', text: "connections between our neuron and the neurons from the first layer.", startTime: 551, endTime: 555 },
    { id: 'seg-146', text: "These weights are just numbers.", startTime: 556, endTime: 557 },
    { id: 'seg-147', text: "Then take all of those activations from the first layer", startTime: 558, endTime: 561 },
    { id: 'seg-148', text: "and compute their weighted sum according to these weights.", startTime: 561, endTime: 565 },
    { id: 'seg-149', text: "I find it helpful to think of these weights as being organized into a", startTime: 567, endTime: 571 },
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
